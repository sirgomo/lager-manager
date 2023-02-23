import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ArtikelAufPaletteDto } from '../dto/artikelAufPalete.dto';
import { ArtikelInfoDto } from '../dto/artikelinfo.dto';
import { DataFurKomisDto } from '../dto/dataFurKomis.dto';
import { PALETTENTYP } from '../dto/lagerPlatz.dto';
import { NeuePaletteDto } from '../dto/neuePalette.dto';
import { HelperService } from '../helper.service';
import { AddartikelComponent } from './addartikel/addartikel.component';
import { FindWareComponent } from './find-ware/find-ware.component';
import { KommisionierService } from './kommisionier.service';
import { NeupalComponent } from './neupal/neupal.component';

@Component({
  selector: 'app-kommisionier',
  templateUrl: './kommisionier.component.html',
  styleUrls: ['./kommisionier.component.scss'],
})
export class KommisionierComponent implements OnInit {
  kommid = 0;
  currentPalatte = 0;
  currentPaletteTyp = PALETTENTYP.EINWEG;
  kommDetails: DataFurKomisDto[] = [];
  borders: string[] = [];
  braucheIchMehr: boolean[] = [];
  uid = '';
  fullPaletteMenge = 0;
  dataRes: MatTableDataSource<DataFurKomisDto> = new MatTableDataSource();
  columnDef = ['platz', 'karton', 'id', 'name'];
  constructor(
    private kommServi: KommisionierService,
    private toastr: ToastrService,
    private dial: MatDialog,
    private helper: HelperService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getLastKomm();
  }

  async getKomm() {
  const tmpArti :Subscription =   await this.kommServi.getKommissionierung(this.kommid).subscribe((data) => {
      if (data[0] !== undefined && data[0] !== null) {
        this.kommDetails.splice(0, this.kommDetails.length);
        this.borders.splice(0, this.borders.length);
        this.braucheIchMehr.splice(0, this.braucheIchMehr.length);
        for (let i = 0; i < data.length; i++) {
          this.braucheIchMehr[i] = false;
          if (data[i].menge > data[i].artikelMengeOnPlatz) {
            this.braucheIchMehr[i] = true;
          }
          this.kommDetails.push(data[i]);
          data[i].menge -= data[i].currentGepackt;
          this.getBorder(data[i].menge, data[i].currentGepackt);
        }
        this.helper.setToolbar([
          'Kommiss Nr: ' + this.kommid,
          'Palette Nr: ' + this.currentPalatte,
        ]);
        this.dataRes = new MatTableDataSource(this.kommDetails);
        tmpArti.unsubscribe();
       
      } else {
        tmpArti.unsubscribe();
        this.toastr.error(Object(data).message);
      }
    });
   tmpArti.add(() => {
    this.noStaticPlatz();
   });
   
  }

  //what we do when we dont have static platz for artikel(why ? each artikel should have static platz....)
  async noStaticPlatz() {
    for (let i = 0; i < this.dataRes.filteredData.length; i++) {
      if(this.dataRes.filteredData[i].platzid === null) {
        const tmpKom: Subscription = await this.kommServi.getPlatzMitArtikels(this.dataRes.filteredData[i].artikelId, this.dataRes.filteredData[i].kreditorId).subscribe((res) => {
        if(res === undefined || res === null || res.length < 1) {
         const err = new Error();
         Object.assign(err, res);
         this.toastr.error(err.message, 'Get Lagerplatz', {timeOut: 800, positionClass: 'toast-top-center'});
         tmpKom.unsubscribe();
        }
        this.dataRes.filteredData[i].platzid = res[0].lagerplatzid;
        this.dataRes.filteredData[i].platz = res[0].lagerplatz;
        this.braucheIchMehr[i] = false;
        tmpKom.unsubscribe();
       });
      }
     
    }
  }
  getCartonMenge(index: number): string {
    const car: string =
      '' +
      Math.floor(
        this.kommDetails[index].menge / this.kommDetails[index].minLos,
      );
    if (this.kommDetails[index].menge % this.kommDetails[index].minLos !== 0) {
      return (
        car +
        ' ' +
        '(' +
        (this.kommDetails[index].menge % this.kommDetails[index].minLos) +
        ')'
      );
    }
    return car;
  }
  async neuePalete(art: ArtikelInfoDto | null, index: number | null) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.minHeight = '100vh';
    conf.minWidth = '100vw';
    conf.panelClass = 'full-screen-modal';
    const tmpNPal: NeuePaletteDto = new NeuePaletteDto();
    tmpNPal.kommId = this.kommid;
    tmpNPal.kommissionierId = Number(localStorage.getItem('myId'));
    tmpNPal.palTyp = PALETTENTYP.EU;
    tmpNPal.liferant = this.kommDetails[0].kreditorId;
    conf.data = tmpNPal;

    await this.dial
      .open(NeupalComponent, conf)
      .afterClosed()
      .subscribe((data) => {
        if (data === undefined || data === null) {
          this.toastr.info('Vorgang Abgebrochen', 'Neue Palette Erstellen', {
            timeOut: 700,
          });
          return;
        }
        //return paletten nr
        this.kommServi.paletteErstellen(data).subscribe((res) => {
          console.log('neue palete ' + res);
          if (isFinite(res)) {
            this.currentPalatte = res;
            this.currentPaletteTyp = tmpNPal.palTyp;
            if (art !== null && index !== null) {
              const tmpData: DataFurKomisDto = new DataFurKomisDto();
              Object.assign(tmpData, this.kommDetails[index]);
              tmpData.platzid = art.lagerplatzid;
              tmpData.menge = art.artikelMenge;
              this.sendMengeToServer(index, tmpData);
            }
          } else {
            this.toastr.error('Etwas ist sichefgegangen, neue Palete wurde nicht erstellt');
          }
        });
      });
  }
  async gewichtErfassen() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.minHeight = '100vh';
    conf.minWidth = '100vw';
    conf.panelClass = 'full-screen-modal';
    const tmpNPal: NeuePaletteDto = new NeuePaletteDto();
    tmpNPal.kommId = this.kommid;
    tmpNPal.kommissionierId = Number(localStorage.getItem('myId'));
    tmpNPal.palTyp = PALETTENTYP.EU;
    tmpNPal.palid = this.currentPalatte;
    tmpNPal.liferant = 1;
    conf.data = tmpNPal;
    await this.dial
      .open(NeupalComponent, conf)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data !== '') {
          this.kommServi.gewichtErfassen(data).subscribe((res) => {
            const tmp: NeuePaletteDto = new NeuePaletteDto();
            Object.assign(tmp, data);
            if (res === tmp.gewicht) {
              this.currentPalatte = 0;
              if(this.kommDetails.length === 0) {
                this.toastr.success('Gewicht gespeichert');
                this.kommid = 0;
                return;
              }
              return this.toastr.success('Gewicht gespeichert');
            }
            return this.toastr.error(
              'Etwas ist schief gelaufen, gewicht wurde nicht erfasst',
            );
          });
        }
      });
  }
  async getLastKomm() {
    await this.kommServi
      .getLastActiveKomm(Number(localStorage.getItem('myId')))
      .subscribe((data) => {
        if (data !== undefined && data.length > 2) {
          const tmp: string[] = String(data).split('/');
          this.kommid = Number(tmp[0]);
          this.currentPalatte = Number(tmp[1]);
          const tmpArr = Object.values(PALETTENTYP);
          for (let i = 0; i < tmpArr.length; i++) {
            if (tmpArr[i] == tmp[2]) {
              this.currentPaletteTyp = tmpArr[i];
            }
          }
          this.getKomm();
        } else {
          this.kommid = 0;
          this.currentPalatte = 0;
        }
      });
  }
  findbyuidorArtId(uid: string) {
    if (this.kommDetails === undefined || this.kommDetails.length === 0) return;
    for (let i = 0; i < this.kommDetails.length; i++) {
      if (Number(uid) === this.kommDetails[i].artikelId) {
        const conf: MatDialogConfig = new MatDialogConfig();
        conf.minHeight = '100vh';
        conf.minWidth = '100vw';
        conf.panelClass = 'full-screen-modal';
        const tmpData: DataFurKomisDto = new DataFurKomisDto();
        Object.assign(tmpData, this.kommDetails[i]);
        conf.data = tmpData;
        this.dial
          .open(AddartikelComponent, conf)
          .afterClosed()
          .subscribe((data) => {
            this.uid = '';
            if (typeof data === 'string' || data === 0) {
              this.toastr.error('Vorgang wurde abgebrochen');
              return;
            }
            this.sendMengeToServer(i, data);
          });
        break;
      } else {
        for (let y = 0; y < this.kommDetails[i].uids.length; y++) {
          if (this.kommDetails[i].uids[y].trim() === uid.trim()) {
            const conf: MatDialogConfig = new MatDialogConfig();
            conf.minHeight = '100vh';
            conf.minWidth = '100vw';
            conf.panelClass = 'full-screen-modal';
            conf.data = this.kommDetails[i];
            this.dial
              .open(AddartikelComponent, conf)
              .afterClosed()
              .subscribe((data) => {
                this.uid = '';
                if (typeof data === 'string' || data === 0) {
                  this.toastr.error('Vorgang wurde abgebrochen');
                  return;
                }
                this.sendMengeToServer(i, data);
              });
            break;
          }
        }
      }
    }
  }
  private sendMengeToServer(i: number, data: DataFurKomisDto) {
    if (data === undefined || data === null || data.menge <= 0) {
      return;
    }
    const tmpArt: ArtikelAufPaletteDto = new ArtikelAufPaletteDto();
    tmpArt.artid = this.kommDetails[i].artikelId;
    tmpArt.artikelMenge = data.menge;
    tmpArt.kommissId = this.kommDetails[i].id;
    tmpArt.kommissionierId = Number(localStorage.getItem('myId'));
    tmpArt.palTyp = this.currentPaletteTyp;
    tmpArt.paletteid = this.currentPalatte;
    tmpArt.liferantId = this.kommDetails[i].kreditorId;
    tmpArt.platzid = data.platzid;
    console.log(tmpArt);
    this.kommServi.addArtikelAufPalette(tmpArt).subscribe((data) => {
      console.log(data);
      if (Number(data) === 1) {
        this.toastr.success('Artikel erfasst', 'Artikel Erfassen', {
          timeOut: 600,
        });
        if (tmpArt.artikelMenge < this.kommDetails[i].menge) {
          this.borders.splice(
            i,
            1,
            'd-flex row-item border border-danger rounded fs-s',
          );
          this.kommDetails[i].menge -= tmpArt.artikelMenge;
          this.kommDetails[i].currentGepackt += tmpArt.artikelMenge;
          if (
            this.kommDetails[i].menge === 0 ||
            this.kommDetails[i].currentGepackt === 0
          ) {
            this.borders.splice(i, 1, 'd-flex row-item border rounded fs-s');
          }
          this.uid = '';
        } else {
          this.uid = '';
          this.borders.splice(i, 1);
          this.kommDetails.splice(i, 1);
        }
      }
    });
  }

  getBorder(menge: number, currentMenge: number) {
    if (currentMenge === 0) {
      this.borders.push('d-flex row-item border rounded fs-s');
    } else if (currentMenge !== 0 && menge !== 0) {
      this.borders.push('d-flex row-item border border-danger rounded fs-s');
    }
  }
  async getPlatzMitArtikel(index: number) {
    let currentArtikelMenge = 0;
    //let currentArtikelId = 0;
   const getMenge: Subscription =  await this.kommServi
      .getArtikelMenge(
        this.kommDetails[index].artikelId,
        this.kommDetails[index].kreditorId,
      )
      .subscribe((data) => {
        if(data.length < 1) {
          getMenge.unsubscribe();
          return;
        }
       
        if (data[0] !== undefined && data[0] !== null) {
          //currentArtikelId = Number(data[0].id);
          currentArtikelMenge = Number(data[0].artikelMenge);
          getMenge.unsubscribe();
        } else {
          getMenge.unsubscribe();
          this.toastr.error(data.message);
        }
      });
   const getPlatzMitArtiekles: Subscription = await this.kommServi
      .getPlatzMitArtikels(
        this.kommDetails[index].artikelId,
        this.kommDetails[index].kreditorId,
      )
      .subscribe((data) => {
        const tmpArtikelInfo: ArtikelInfoDto[] = [];
        Object.assign(tmpArtikelInfo, data);
        if (Object(data).message !== undefined && Object(data).message !== '') {
          this.toastr.error(Object(data).message);
          getPlatzMitArtiekles.unsubscribe();
          return;
        }
        if (tmpArtikelInfo === undefined || tmpArtikelInfo.length === 0) {
          this.toastr.info('Es gibt kein mehr!', 'Kein Artikel Mehr', {
            timeOut: 800,
          });
          getPlatzMitArtiekles.unsubscribe();
          return;
        }
        const artikelMenge: number =
          this.kommDetails[index].menge -
          this.kommDetails[index].currentGepackt;
        const conf: MatDialogConfig = new MatDialogConfig();
        conf.height = '100vh';
        conf.width = '100vw';
        conf.minWidth = '100vw';
        conf.panelClass = 'full-screen-modal';
        conf.data = [tmpArtikelInfo, index, artikelMenge];
       const tmpDialog: Subscription = this.dial
          .open(FindWareComponent, conf)
          .afterClosed()
          .subscribe((data) => {
            if (
              data !== undefined &&
              data !== null &&
              data[0] !== undefined &&
              data[0] !== null
            ) {
              // artikelMenge -- 1 nachfullen -- 2 kommissioniren
              if (data[0].artikelMenge === 1) {
                if (currentArtikelMenge > this.kommDetails[index].menge) {
                  this.toastr.error(
                    'Am Lagerplatz ist mehr als notwendig, Abgebrochen',
                  );
                  tmpDialog.unsubscribe();
                  return;
                }
              const plNachfullen: Subscription =  this.kommServi
                  .lagerPlatzNachfullen(
                    this.kommDetails[index].platzid,
                    data[0].lagerplatzid,
                  )
                  .subscribe((res) => {
                    
                    if (res !== 1) {
                      const err = new Error();
                      Object.assign(err, res);
                      this.toastr.error(
                        err.message,
                        'Platz Nachfullen',
                      );
                      plNachfullen.unsubscribe();
                      return;
                    }
                    plNachfullen.unsubscribe()
                    this.toastr.success(
                      'Platz wurde nachgefullt',
                      'Platz Nachfullen',
                    );
                  });
              } else {
                // kommissioniren
                if (this.kommDetails[index].menge < data[0].artikelMenge) {
                  this.toastr.error(
                    'Du solltest der Lagerplatz nachfüllen nicht neue Palette erfassen',
                  );
                  tmpDialog.unsubscribe();
                  return;
                }
                if (this.currentPalatte !== 0) {
                  this.toastr.error(
                    'Das Gewicht solltest du zuerst erfassen',
                    'Gewicht Erfassen',
                  );
                  tmpDialog.unsubscribe();
                  return;
                }
                //neue palete so nr erstellen und die ware gleich an die neue palette bewegen
                this.currentPalatte = 0;
                this.neuePalete(data[0], data[1]);
               
              }
              tmpDialog.unsubscribe();
            }
          });
          getPlatzMitArtiekles.unsubscribe();
      });
  }
  isNaN() {
    return !Number.isFinite(this.kommid);
  }
  kommVerlassen() {
    //TODO what ?
    console.log('kommissionierung verlassen');
  }
}
