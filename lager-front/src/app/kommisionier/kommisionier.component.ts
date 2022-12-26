import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ArtikelAufPaletteDto } from '../dto/artikelAufPalete.dto';
import { ArtikelInfo } from '../dto/artikelinfo.dto';
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
  async neuePalete() {
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
        this.kommServi.paletteErstellen(data).subscribe((res) => {
          this.currentPalatte = res;
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
    tmpArt.kommissId = this.kommid;
    tmpArt.kommissionierId = Number(localStorage.getItem('myId'));
    tmpArt.palTyp = this.currentPaletteTyp;
    tmpArt.paletteid = this.currentPalatte;
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
          this.uid = '';
        } else {
          this.uid = '';
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
    await this.kommServi
      .getPlatzMitArtikels(
        this.kommDetails[index].artikelId,
        this.kommDetails[index].kreditorId,
      )
      .subscribe((data) => {
        const tmpArtikelInfo: ArtikelInfo[] = [];
        Object.assign(tmpArtikelInfo, data);
        console.log(tmpArtikelInfo);
        if (Object(data).message !== undefined && Object(data).message !== '') {
          this.toastr.error(Object(data).message);
          return;
        }
        if (tmpArtikelInfo === undefined || tmpArtikelInfo.length === 0) {
          this.toastr.info('Es gibt kein mehr!', 'Kein Artikel Mehr', {
            timeOut: 700,
          });
          return;
        }
        const conf: MatDialogConfig = new MatDialogConfig();
        conf.height = '100vh';
        conf.width = '100vw';
        conf.minWidth = '100vw';
        conf.panelClass = 'full-screen-modal';
        conf.data = tmpArtikelInfo;
        this.dial.open(FindWareComponent, conf);
      });
  }
}
