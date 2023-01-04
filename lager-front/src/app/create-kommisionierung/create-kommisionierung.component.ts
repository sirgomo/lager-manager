import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataDilerService } from '../data-diler.service';
import { AddArtikelKommissDto } from '../dto/addArtikelKommiss.dto';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import { DispositorDto } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { ARTIKELSTATUS, KommissDetailsDto } from '../dto/kommissDetails.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { UserDataDto } from '../dto/userData.dto';
import { HelperService } from '../helper.service';
import { VerkaufService } from '../verkauf/verkauf.service';

@Component({
  selector: 'app-create-kommisionierung',
  templateUrl: './create-kommisionierung.component.html',
  styleUrls: ['./create-kommisionierung.component.scss'],
})
export class CreateKommisionierungComponent implements OnInit {
  kommissForm: FormGroup;
  verkaufer = Number(localStorage.getItem('myId'));
  verkauferData: UserDataDto = new UserDataDto();
  readonly kommStatus: typeof KOMMISIONSTATUS = KOMMISIONSTATUS;
  dispo: DispositorDto[] = [];
  spedi: SpeditionDto[] = [];
  spediSelected = -1;
  searchModel = '';
  rabats: number[] = [];
  artikels: ArtikelKommissDto[] = [];
  artikelMenge: number[] = [];
  artikelMengeEdit: number[] = [];
  artikelsInKomm: ArtikelKommissDto[] = [];
  artikelStatus: string[] = [];
  showArtikelsInKomm = 0;
  currentKomm: KomissDTO = new KomissDTO();
  stellplattzeB = 0;
  totalGewichtB = 0;
  logisticBelegNr: string[] = [];
  logisticBeleg = '';
  border: string[] = [];

  constructor(
    private kommServ: VerkaufService,
    private fb: FormBuilder,
    private helper: HelperService,
    private dataDiel: DataDilerService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateKommisionierungComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: KomissDTO,
  ) {
    this.kommissForm = this.fb.group({
      id: Number,
      verkauferId: Number,
      maxPalettenHoher: Number,
      gewunschtesLieferDatum: Date,
      dispositorId: Number,
      buchungsDatum: Date,
      falligkeitDatum: Date,
      skonto: Number,
      skontoFrist: Number,
      kommissStatus: KOMMISIONSTATUS,
      spedition: Number,
      versorgungId: [''],
      kommDetails: KommissDetailsDto,
    });
    this.kommStatus = KOMMISIONSTATUS;
  }
  //TODO show artikels powinno pokazywac w innym oknie a nie tak samo bo sie zlewa
  ngOnInit(): void {
    if (
      this.dialogData !== undefined &&
      this.dialogData !== null &&
      isFinite(this.dialogData.id)
    ) {
      this.currentKomm = this.dialogData;
    }
    this.start();
  }
  async start() {
    this.spedi = await this.dataDiel.getSpeditors();
    this.dispo = await this.dataDiel.getDispositors();
    await this.getArtikle();
    this.rabats = Array(this.artikels.length);
  }

  async getUser() {
    if (isFinite(this.currentKomm.id)) {
      await this.kommServ
        .getUserById(this.currentKomm.verkauferId)
        .subscribe((data) => {
          if (data !== null) {
            this.verkauferData = new UserDataDto();
            this.verkauferData = data;
            this.verkaufer = data.id;
          }
        });
    } else {
      await this.kommServ.getUserById(this.verkaufer).subscribe((data) => {
        if (data !== null) {
          this.verkauferData = new UserDataDto();
          this.verkauferData = data;
        }
      });
    }
  }
  addlogisticBeleg(text: string) {
    if (text.length < 3) {
      this.toastr.error('Logistik Beleg nr ist zu kurz');
    } else {
      this.toastr.success(
        'Logistik Beleg nr wurde hinzugefügt, aber noch nicht gespeichert!',
      );
      this.logisticBelegNr.push(text);
      this.logisticBeleg = text;
    }
  }
  onChange(text: string) {
    this.logisticBeleg = text;
  }
  async getArtikle() {
    //how many artikels are aviable ?
    // total menge on lager - menge in reservation entity - das was fehlt
    this.artikels.splice(0, this.artikels.length);
    await this.kommServ.getArtikles().subscribe((data) => {
      for (let i = 0; i !== data.length; i++) {
        const tmp: ArtikelKommissDto = new ArtikelKommissDto();
        Object.assign(tmp, data[i]);
        if (tmp.resMenge !== null) {
          tmp.total -= data[i].resMenge;
        }
        if (tmp.fehlArtikelMenge !== null) {
          tmp.total -= data[i].fehlArtikelMenge;
        }
        this.artikels.push(tmp);
      }
      this.getKommFromKommponent();
      this.getUser();
    });
  }
  onSearch(text: string) {
    this.artikels = this.helper.onSearchK(text, this.artikels);
  }
  artikelTrackBy(index: number) {
    if (this.artikels !== undefined && this.artikels.length > 0) {
      return this.artikels[index].artId;
    }
    return;
  }
  async checkVerfurbarkeit(index: number) {
    await this.kommServ
      .getCurrentVerfugbareMenge(this.artikels[index].artId)
      .subscribe((data) => {
        const tmp: ArtikelKommissDto = new ArtikelKommissDto();
        Object.assign(tmp, data);

        if (tmp.resMenge !== null) {
          tmp.total -= data.resMenge;
        }
        if (data.fehlArtikelMenge !== null) {
          tmp.total -= data.fehlArtikelMenge;
        }
        if (tmp.total < 0) tmp.total = 0;
        this.artikels[index].total = tmp.total;
      });
  }
  async saveKommissionierung(komm: KomissDTO) {
    return await this.kommServ
      .createKommissionierung(komm)
      .subscribe((data) => {
        if (data !== null && isFinite(data.id)) {
          this.toastr.success('Kommissionierung gespeichert');
          this.dialogRef.close(data);
          return;
        }
        this.toastr.error(
          'Etwas ist schieff gelaufen, ich konnte die Kommissionierung nicht spiechern',
        );
      });
  }
  async updateKommissionierung(komm: KomissDTO) {
    komm.kommDetails = this.currentKomm.kommDetails;
    return await this.kommServ.updateKomm(komm).subscribe((data) => {
      if (Object.values(data)[2] === 1) {
        this.kommissForm.patchValue(komm);
        this.toastr.success('Das Kommissionierung wurde aktualisiert');
        this.dialogRef.close(komm);
      } else {
        this.toastr.error('Etwas ist schieff gegangen');
      }
    });
  }
  getKommFromKommponent() {
    this.reasignKomm();
  }
  reasignKomm() {
    if (this.currentKomm.id !== undefined && this.currentKomm.id !== 0) {
      // this.kommissForm.reset();
      this.artikelsInKomm.splice(0, this.artikelsInKomm.length);

      this.kommissForm.patchValue(this.currentKomm);
      this.kommissForm
        .get('gewunschtesLieferDatum')
        ?.setValue(
          new Date(this.currentKomm.gewunschtesLieferDatum)
            .toISOString()
            .split('T')[0],
        );
      this.spediSelected = this.kommissForm.get('spedition')?.getRawValue();
      this.kommissForm.get('spedition')?.valueChanges.subscribe((data) => {
        this.spediSelected = data;
      });
      if (
        this.currentKomm.kommDetails === undefined &&
        this.currentKomm.kommDetails === null
      ) {
        return;
      }
      for (let y = 0; y !== this.currentKomm.kommDetails.length; y++) {
        this.logisticBelegNr.push(
          this.currentKomm.kommDetails[y].logisticBelegNr,
        );
        for (let i = 0; i !== this.artikels.length; i++) {
          if (
            this.currentKomm.kommDetails[y].artikelId ===
              this.artikels[i].artId &&
            this.currentKomm.kommDetails[y].kreditorId ===
              this.artikels[i].liferantId
          ) {
            let tmpArti: ArtikelKommissDto = new ArtikelKommissDto();
            Object.assign(tmpArti, this.artikels[i]);
            tmpArti.total = this.currentKomm.kommDetails[y].menge;
            tmpArti.logisticBelegNr =
              this.currentKomm.kommDetails[y].logisticBelegNr;
            tmpArti.rabatt = this.currentKomm.kommDetails[y].rabatt;
            tmpArti.verPrice = this.getPriceMitRabat(
              this.artikels[i].verPrice,
              this.currentKomm.kommDetails[y].rabatt,
            );
            this.artikelsInKomm.push(tmpArti);
            tmpArti = this.setGewichtFurArtikel(tmpArti);
            this.artikelStatus[y] = this.currentKomm.kommDetails[y].gepackt;
            break;
          }
        }
      }
      this.setBorderfurArtikel();
      if (this.currentKomm.kommDetails.length > 0) {
        const tmpSet = new Set(this.logisticBelegNr);
        this.logisticBelegNr = Array.from(tmpSet);
        this.logisticBeleg =
          this.logisticBelegNr[this.logisticBelegNr.length - 1];
      }
    } else {
      this.kommissForm.reset();
      this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
      this.kommissForm
        .get('kommissStatus')
        ?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
      this.kommissForm.get('spedition')?.valueChanges.subscribe((data) => {
        this.spediSelected = data;
      });
    }
    if (this.artikelsInKomm !== undefined && this.artikelsInKomm.length > 0) {
      let stellplattze: number;
      let totalGewicht: number;
      // eslint-disable-next-line prefer-const
      ({ stellplattze, totalGewicht } = this.helper.getPaletsDeatails(
        this.artikelsInKomm,
      ));
      this.stellplattzeB = stellplattze;
      this.totalGewichtB = totalGewicht;
    }
  }
  setBorderfurArtikel() {
    this.border.splice(0, this.border.length);
    for (let i = 0; i < this.artikelsInKomm.length; i++) {
      if (
        this.currentKomm.kommDetails[i].gepackt === ARTIKELSTATUS.GEPACKT ||
        this.currentKomm.kommDetails[i].gepackt === ARTIKELSTATUS.TEILGEPACKT
      ) {
        this.border.push('table-success border border-success');
      } else if (this.currentKomm.kommDetails[i].inBestellung) {
        this.border.push('border border-danger table-danger');
      } else {
        this.border.push('border border-success table-light');
      }
    }
  }
  newKomm() {
    this.kommissForm.reset();
    this.currentKomm = new KomissDTO();
    this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
    this.kommissForm
      .get('kommissStatus')
      ?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
    this.kommissForm.get('spedition')?.valueChanges.subscribe((data) => {
      this.spediSelected = data;
    });
  }
  setGewichtFurArtikel(tmpArti: ArtikelKommissDto) {
    const totalkartons: number = Math.floor(
      tmpArti.total / tmpArti.minLosMenge,
    );
    tmpArti.gewicht = totalkartons * tmpArti.gewicht;
    return tmpArti;
  }
  async addArtikelToKomm(index: number, edit: boolean) {
    if (!isFinite(this.currentKomm.id)) {
      this.toastr.error('Du musst zuerst kommisionirung speichern!', 'Error', {
        timeOut: 900,
      });
      return;
    }
    if (this.logisticBeleg.length < 3) {
      this.toastr.error(
        'Du musst zuerst Logistic Beleg Nr eingeben und speichern',
        'Error',
        {
          timeOut: 900,
        },
      );
      return;
    }
    const art: AddArtikelKommissDto[] = [];
    if (!edit && this.artikelMenge[index] > this.artikels[index].total) {
      let tmp: number = this.artikelMenge[index] - this.artikels[index].total;
      this.artikelMenge[index] = this.artikels[index].total;
      if (
        window.confirm(
          'Wir können nur ' +
            this.artikels[index].total +
            ' lifern, soll ' +
            tmp +
            ' bestellt werden ?',
        )
      ) {
        const tmpart: AddArtikelKommissDto = new AddArtikelKommissDto();
        if (edit) {
          tmpart.artikelId = this.artikelsInKomm[index].artId;
          tmpart.kommDeatailnr = this.currentKomm.kommDetails[index].id;
          tmpart.kreditorId = this.currentKomm.kommDetails[index].kreditorId;
        } else {
          tmpart.artikelId = this.artikels[index].artId;
          tmpart.kreditorId = this.artikels[index].liferantId;
        }

        if (tmp % this.artikels[index].minLosMenge !== 0) {
          tmp +=
            this.artikels[index].minLosMenge -
            (tmp % this.artikels[index].minLosMenge);
        }
        tmpart.kommNr = Number(this.kommissForm.get('id')?.getRawValue());
        tmpart.artMenge = tmp;
        tmpart.rabatt = this.rabats[index];
        tmpart.inBestellung = true;
        const artForLocal: ArtikelKommissDto = new ArtikelKommissDto();
        for (let i = 0; i !== this.artikels.length; i++) {
          if (tmpart.artikelId === this.artikels[i].artId) {
            Object.assign(artForLocal, this.artikels[i]);
            artForLocal.total = tmpart.artMenge;
            artForLocal.rabatt = tmpart.rabatt;
            this.artikelsInKomm.push(artForLocal);
            break;
          }
        }
        tmpart.logisticBelegNr = this.logisticBeleg;
        art.push(tmpart);
      } else {
        this.toastr.show(' ok, keine andreungen!', '', { timeOut: 800 });
        return;
      }
    }
    if (
      edit &&
      this.artikelMengeEdit[index] > 0 &&
      this.artikelMengeEdit[index] > this.artikelsInKomm[index].total
    ) {
      if (this.currentKomm.kommDetails[index].gepackt === 'GEPACKT') {
        this.toastr.error(
          'Du kannst bei gepackten ware die menge nicht ändern!',
          'Menge ändern',
        );
        return;
      }
      if (this.currentKomm.kommDetails[index].gepackt === 'TEILGEPACKT') {
        this.toastr.error(
          'Die ware ist schön teilweise gepackt, kann man nicht ändern!',
          'Menge ändern',
        );
        return;
      }
      for (let i = 0; i !== this.artikels.length; i++) {
        if (this.artikelsInKomm[index].artId === this.artikels[i].artId) {
          if (
            this.artikelMengeEdit[index] >
            this.artikels[i].total + this.artikelsInKomm[index].total
          ) {
            let tmp: number =
              this.artikelMengeEdit[index] -
              (this.artikels[i].total + this.artikelsInKomm[index].total);
            const totalWasWirHaben =
              this.artikels[i].total + this.artikelsInKomm[index].total;
            let message: string =
              'Wir können nur ' +
              totalWasWirHaben +
              ' lifern, soll ' +
              tmp +
              ' bestellt werden ?';
            if (
              this.currentKomm.kommDetails[index].artikelId ===
                this.artikelsInKomm[index].artId &&
              this.currentKomm.kommDetails[index].inBestellung
            ) {
              tmp = this.artikelMengeEdit[index];
              message =
                'Wir haben ' +
                this.artikelsInKomm[index].total +
                ' in bestellung ,soll noch zusätzlich ' +
                tmp +
                ' bestellt werden ?';
            }
            this.artikelMengeEdit[index] = this.artikels[i].total;
            if (window.confirm(message)) {
              const tmpart: AddArtikelKommissDto = new AddArtikelKommissDto();
              tmpart.artikelId = this.artikelsInKomm[index].artId;
              tmpart.kreditorId = this.artikelsInKomm[index].liferantId;
              this.currentKomm.kommDetails[index].id = -1;
              if (tmp % this.artikels[i].minLosMenge !== 0) {
                tmp +=
                  this.artikels[i].minLosMenge -
                  (tmp % this.artikels[i].minLosMenge);
              }
              tmpart.kommNr = Number(this.kommissForm.get('id')?.getRawValue());
              tmpart.artMenge = tmp;
              tmpart.logisticBelegNr =
                this.artikelsInKomm[index].logisticBelegNr;
              tmpart.inBestellung = true;
              const artForLocal: ArtikelKommissDto = new ArtikelKommissDto();
              Object.assign(artForLocal, this.artikels[i]);
              artForLocal.total = tmpart.artMenge;
              this.artikelsInKomm.push(artForLocal);
              art.push(tmpart);
            } else {
              this.toastr.show(' ok, keine andreungen!', '', { timeOut: 800 });
              return;
            }
          }
          break;
        }
      }
    }

    if (!edit && this.artikelMenge[index] > 0) {
      if (
        this.artikelMenge[index] % this.artikels[index].minLosMenge !== 0 &&
        this.artikelMenge[index] !== this.artikels[index].total
      ) {
        if (!window.confirm('Willst du ein Anbruch schicken ?')) {
          this.artikelMenge[index] +=
            this.artikels[index].minLosMenge -
            (this.artikelMenge[index] % this.artikels[index].minLosMenge);
          return;
        }
      }
      const artToAd: AddArtikelKommissDto = new AddArtikelKommissDto();
      artToAd.artMenge = this.artikelMenge[index];
      artToAd.rabatt = this.rabats[index];
      artToAd.artikelId = this.artikels[index].artId;
      artToAd.kreditorId = this.artikels[index].liferantId;
      artToAd.kommNr = Number(this.kommissForm.get('id')?.getRawValue());
      const tmpArt: ArtikelKommissDto = new ArtikelKommissDto();
      Object.assign(tmpArt, this.artikels[index]);
      tmpArt.total = this.artikelMenge[index];
      this.artikels[index].total -= this.artikelMenge[index];
      this.artikelsInKomm.push(tmpArt);
      this.artikelMenge[index] = 0;
      this.rabats[index] = 0;
      artToAd.logisticBelegNr = this.logisticBeleg;
      art.push(artToAd);
    } else {
      if (this.currentKomm.kommDetails[index].gepackt === 'GEPACKT') {
        this.toastr.error(
          'Du kannst bei gepackten ware die menge nicht ändern!',
          'Menge ändern',
        );
        return;
      }
      if (this.currentKomm.kommDetails[index].gepackt === 'TEILGEPACKT') {
        this.toastr.error(
          'Die ware ist schön teilweise gepackt, kann man nicht ändern!',
          'Menge ändern',
        );
        return;
      }
      if (this.artikelMengeEdit[index] > 0) {
        if (
          this.artikelMengeEdit[index] % this.artikels[index].minLosMenge !==
            0 &&
          this.currentKomm.kommDetails[index].id !== -1
        ) {
          if (!window.confirm('Willst du ein Anbruch schicken ?')) {
            this.artikelMengeEdit[index] +=
              this.artikels[index].minLosMenge -
              (this.artikelMengeEdit[index] % this.artikels[index].minLosMenge);
            return;
          }
        }
        const artToAd: AddArtikelKommissDto = new AddArtikelKommissDto();
        artToAd.artikelId = this.artikelsInKomm[index].artId;
        artToAd.kreditorId = this.artikelsInKomm[index].liferantId;
        artToAd.kommNr = Number(this.kommissForm.get('id')?.getRawValue());
        artToAd.logisticBelegNr = this.artikelsInKomm[index].logisticBelegNr;
        artToAd.inBestellung = this.currentKomm.kommDetails[index].inBestellung;
        artToAd.rabatt = this.rabats[index];
        artToAd.kommDeatailnr = this.currentKomm.kommDetails[index].id;
        artToAd.artMenge = this.artikelMengeEdit[index];

        art.push(artToAd);
        this.artikelMengeEdit[index] = 0;
        this.rabats[index] = 0;
      }
    }
    art.reverse();
    this.saveArtikel(art);
  }
  async saveArtikel(art: AddArtikelKommissDto[]) {
    return await this.kommServ.addArtikelToKomm(art).subscribe((data) => {
      if (data !== null) {
        Object.assign(this.currentKomm, data[data.length - 1]);
        this.reasignKomm();
        if (art[art.length - 1].inBestellung) {
          console.log(art[art.length - 1]);
          this.setBorderfurArtikel(art as unknown as KommissDetailsDto);
        }
      }
    });
  }
  showArtikelsinKomm() {
    if (this.showArtikelsInKomm === 0) {
      this.showArtikelsInKomm = 1;
    } else {
      this.showArtikelsInKomm = 0;
    }
  }
  deletePositionInKomm(index: number) {
    if (this.currentKomm.kommDetails[index].gepackt === 'GEPACKT') {
      this.toastr.error(
        'Du kannst gepackt ware nicht löschen!',
        'Ware Löschen',
      );
      return;
    }
    if (this.currentKomm.kommDetails[index].gepackt === 'TEILGEPACKT') {
      this.toastr.error(
        'Die ware ist schön teilweise gepackt, kann man nicht ändern!',
        'Menge ändern',
      );
      return;
    }
    this.kommServ
      .deletePosInKom(this.currentKomm.kommDetails[index].id)
      .subscribe((data) => {
        console.log(data);
        if (data == 1) {
          for (let i = 0; i !== this.artikels.length; i++) {
            if (
              this.currentKomm.kommDetails[index].artikelId ===
                this.artikels[i].artId &&
              !this.currentKomm.kommDetails[index].inBestellung
            ) {
              this.artikels[i].total +=
                this.currentKomm.kommDetails[index].menge;
            }
          }
          this.currentKomm.kommDetails.splice(index, 1);
          this.reasignKomm();
        }
      });
  }
  getCurrentPrice(index: number): number {
    if (this.rabats[index] !== undefined && this.rabats[index] > 0) {
      return Number(
        Number(
          this.artikels[index].verPrice -
            (this.artikels[index].verPrice * this.rabats[index]) / 100,
        ).toFixed(2),
      );
    }
    return this.artikels[index].verPrice;
  }
  getPriceMitRabat(price: number, rabatt: number) {
    return Number((price - (price * rabatt) / 100).toFixed(2));
  }
}
