import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ArtikelAufPaletteDto } from '../dto/artikelAufPalete.dto';
import { ArtikelInfoDto } from '../dto/artikelinfo.dto';
import { DataFurKomisDto } from '../dto/dataFurKomis.dto';
import { PALETTENTYP } from '../dto/lagerPlatz.dto';
import { NeuePaletteDto } from '../dto/neuePalette.dto';
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
  uid = '';
  fullPaletteMenge = 0;
  constructor(
    private kommServi: KommisionierService,
    private toastr: ToastrService,
    private dial: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getLastKomm();
  }
  async getKomm() {
    await this.kommServi.getKommissionierung(this.kommid).subscribe((data) => {
      if (data !== undefined && data !== null) {
        this.kommDetails.splice(0, this.kommDetails.length);
        this.borders.splice(0, this.borders.length);
        for (let i = 0; i < data.length; i++) {
          this.kommDetails.push(data[i]);
          data[i].menge -= data[i].currentGepackt;
          this.getBorder(data[i].menge, data[i].currentGepackt);
        }
      } else {
        this.toastr.error(Object(data).message);
      }
    });
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
  async neuePalete(art: ArtikelInfoDto | null) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.minHeight = '100vh';
    conf.minWidth = '100vw';
    conf.panelClass = 'full-screen-modal';
    const tmpNPal: NeuePaletteDto = new NeuePaletteDto();
    tmpNPal.kommId = this.kommid;
    tmpNPal.kommissionierId = Number(localStorage.getItem('myId'));
    tmpNPal.palTyp = PALETTENTYP.EU;
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
        this.kommServi.paletteErstellen(data).subscribe((res) => {
          console.log('neue palete ' + res);
          if (isFinite(res)) {
            this.currentPalatte = res;
            if (art !== null) {
              //TODO
            }
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
      if (uid.length > 1 && isFinite(Number(uid))) {
        if (Number(uid) === this.kommDetails[i].artikelId) {
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
      if (uid.length > 1) {
        for (let y = 0; y < this.kommDetails[i].uids.length; y++) {
          if (this.kommDetails[i].uids[y] === uid) {
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
  private sendMengeToServer(i: number, data: any) {
    const tmpArt: ArtikelAufPaletteDto = new ArtikelAufPaletteDto();
    tmpArt.artid = this.kommDetails[i].artikelId;
    tmpArt.artikelMenge = data;
    tmpArt.kommissId = this.kommDetails[i].id;
    tmpArt.kommissionierId = Number(localStorage.getItem('myId'));
    tmpArt.palTyp = this.currentPaletteTyp;
    tmpArt.paletteid = this.currentPalatte;
    tmpArt.platzid = this.kommDetails[i].platzid;
    this.kommServi.addArtikelAufPalette(tmpArt).subscribe((data) => {
      if (data === 1) {
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
    } else if (currentMenge !== 0 && currentMenge < menge) {
      this.borders.push('d-flex row-item border border-danger rounded fs-s');
    } else {
      this.toastr.error(
        'Etwas ist schieff gegangen, currentMenge is großer als menge!!',
      );
    }
  }
  async getPlatzMitArtikel(index: number) {
    let currentArtikelMenge = 0;
    let currentArtikelId = 0;
    await this.kommServi
      .getArtikelMenge(
        this.kommDetails[index].artikelId,
        this.kommDetails[index].kreditorId,
      )
      .subscribe((data) => {
        if (data !== undefined && data !== null) {
          currentArtikelId = Number(data[0].id);
          currentArtikelMenge = Number(data[0].artikelMenge);
        } else {
          this.toastr.error(data.message);
        }
      });
    await this.kommServi
      .getPlatzMitArtikels(
        this.kommDetails[index].artikelId,
        this.kommDetails[index].kreditorId,
      )
      .subscribe((data) => {
        const tmpArtikelInfo: ArtikelInfoDto[] = [];
        Object.assign(tmpArtikelInfo, data);
        console.log(tmpArtikelInfo);
        if (Object(data).message !== undefined && Object(data).message !== '') {
          this.toastr.error(Object(data).message);
          return;
        }
        if (tmpArtikelInfo === undefined || tmpArtikelInfo.length === 0) {
          this.toastr.info('Es gibt kein mehr!', 'Kein Artikel Mehr', {
            timeOut: 800,
          });
          return;
        }
        const conf: MatDialogConfig = new MatDialogConfig();
        conf.height = '100vh';
        conf.width = '100vw';
        conf.minWidth = '100vw';
        conf.panelClass = 'full-screen-modal';
        conf.data = [tmpArtikelInfo, index];
        this.dial
          .open(FindWareComponent, conf)
          .afterClosed()
          .subscribe((data) => {
            if (
              data !== undefined &&
              data[0] !== undefined &&
              data[0] !== null
            ) {
              // artikelMenge -- 1 nachfullen -- 2 kommissioniren
              if (data[0].artikelMenge === 1) {
                if (currentArtikelMenge > this.kommDetails[index].menge) {
                  this.toastr.error(
                    'Am Lagerplatz ist mehr als notwendig, Abgebrochen',
                  );
                  return;
                }
                this.kommServi
                  .lagerPlatzNachfullen(
                    this.kommDetails[index].platzid,
                    data[0].id,
                  )
                  .subscribe((res) => {
                    if (res !== 1) {
                      this.toastr.error(
                        'Etwas ist schieff gelaufen, platz wurde nicht nachgefullt',
                        'Platz Nachfullen',
                      );
                      return;
                    }
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
                  return;
                }
                if (this.currentPalatte !== 0) {
                  this.toastr.error(
                    'Das Gewicht solltest du zuerst erfassen',
                    'Gewicht Erfassen',
                  );
                  return;
                }
                //neue palete so nr erstellen und die ware gleich an die neue palette bewegen
                this.currentPalatte = 0;
                this.neuePalete(data[0]);
              }
            }
          });
      });
  }
}
