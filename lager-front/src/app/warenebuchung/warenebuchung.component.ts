import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ArtikelService } from '../artikel/artikel.service';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { ArtikelDTO } from '../dto/artikel.dto';
import { BestArtikelMengeDto } from '../dto/bestArtikelMenge.dto';
import { DispositorDto } from '../dto/dispositor.dto';
import { GebuchtesArtikelsDto } from '../dto/gebuchtesArtikels.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';
import { HelperService } from '../helper.service';
import { WarenBuchungService } from './warenbuchung.service';

@Component({
  selector: 'app-warenebuchung',
  templateUrl: './warenebuchung.component.html',
  styleUrls: ['./warenebuchung.component.scss'],
})
export class WarenebuchungComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  isNaN: Function = isNaN;
  buchngen: WarenBuchungDto[] = [];
  buchung: WarenBuchungDto = new WarenBuchungDto();
  formBuchung: FormGroup;
  show = 1;
  searchModel = '';
  artikels: ArtikelDTO[] = [];
  artikelMenge: number[] = new Array(this.artikels.length);
  dispositors: DispositorDto[] = [];
  dispo = false;
  nettoArr: number[] = new Array(this.artikels.length);
  steuArr: number[] = new Array(this.artikels.length);

  buchungArtikelMenge: GebuchtesArtikelsDto[] = [];

  constructor(
    private buchServi: WarenBuchungService,
    private fb: FormBuilder,
    private helper: HelperService,
    private artService: ArtikelService,
    private dispServic: DatenpflegeService,
    private toastr: ToastrService,
  ) {
    this.formBuchung = this.fb.group({
      id: Number,
      artikelid: Number,
      menge: Number,
      tor: [''],
      kreditorId: Number,
      eingebucht: false,
      bestellungId: Number,
      artikelsGebucht: Boolean,
      lieferscheinNr: [''],
      empfangDatum: Date,
      priceNetto: Number,
      mehrwertsteuer: Number,
    });
  }

  ngOnInit(): void {
    this.getDispositors();
  }
  async getBuchungen() {
    this.buchngen.splice(0, this.buchngen.length);
    await this.buchServi.getAllBuchungen().subscribe((data) => {
      data.forEach((buchung) => {
        if (!buchung.eingebucht) {
          this.buchngen.push(buchung);
        }
      });
      this.show = 1;
    });
  }
  async getArtikels() {
    this.artikels.splice(0, this.artikels.length);
    await this.artService.getAllArtikel().subscribe((data) => {
      data.forEach((art) => {
        this.artikels.push(art);
      });
      this.getBuchungen();
    });
  }
  getBrutto(i: number) {
    if (isFinite(this.steuArr[i])) {
      return (
        '' +
        (this.nettoArr[i] + (this.nettoArr[i] * this.steuArr[i]) / 100).toFixed(
          2,
        )
      );
    }
    return '';
  }
  getTotalBrutto(i: number) {
    if (isFinite(this.artikelMenge[i])) {
      return (
        (this.nettoArr[i] + (this.nettoArr[i] * this.steuArr[i]) / 100) *
        this.artikelMenge[i]
      ).toFixed(2);
    }
    return '';
  }
  createBuchung() {
    this.formBuchung.reset();
    this.show = 2;
  }
  bearbeiteBuchung(id: number) {
    this.formBuchung.reset();
    this.formBuchung.setValue(this.buchngen[id]);
    this.getArtikelsInBuchung();
  }
  addArtikel(artikelid: number, menge: number, index: number) {
    const bestelungId: number = this.formBuchung
      .get('bestellungId')
      ?.getRawValue();
    const kreditorId: number = this.formBuchung
      .get('kreditorId')
      ?.getRawValue();
    if (bestelungId === null) {
      this.toastr.error('Das Buchung muss zuerst gespeichert werden !');
      return;
    }
    if (!isFinite(this.steuArr[index]) && !isFinite(this.nettoArr[index])) {
      this.toastr.error('Du musst den Preise und Mehrwerhsteure eingeben');
      return;
    }
    if (kreditorId !== this.artikels[index].liferantId) {
      if (
        window.confirm(
          'Lieferant und artikel Lieferung sind nicht die selber, abbrechen ?',
        )
      ) {
        this.nettoArr.splice(0, this.nettoArr.length);
        this.nettoArr = new Array(this.artikels.length);
        this.steuArr.splice(0, this.steuArr.length);
        this.steuArr = new Array(this.artikels.length);
        return;
      }
    }
    this.artikelMenge.splice(0, this.artikelMenge.length);
    const bucharti: BestArtikelMengeDto = new BestArtikelMengeDto();
    bucharti.artikelId = artikelid;
    bucharti.bestellungId = bestelungId;
    bucharti.menge = menge;
    bucharti.mehrwertsteuer = this.steuArr[index];
    bucharti.priceNetto = this.nettoArr[index];
    bucharti.liferantId = this.artikels[index].liferantId;
    this.buchServi.addArtikel(bucharti).subscribe((data) => {
      if (isFinite(data.bestellungId)) {
        this.nettoArr.splice(0, this.nettoArr.length);
        this.nettoArr = new Array(this.artikels.length);
        this.steuArr.splice(0, this.steuArr.length);
        this.steuArr = new Array(this.artikels.length);
        this.refreshArtikels(data, index);
        this.toastr.success('Artikel zugefugt', 'Artikel', { timeOut: 400 });
      } else {
        const e = new Error();
        Object.assign(e, data);
        this.toastr.error(e.message);
        this.nettoArr.splice(0, this.nettoArr.length);
        this.nettoArr = new Array(this.artikels.length);
        this.steuArr.splice(0, this.steuArr.length);
        this.steuArr = new Array(this.artikels.length);
      }
    });
  }
  refreshArtikels(art: BestArtikelMengeDto, index: number) {
    const bestelungId: number = this.formBuchung
      .get('bestellungId')
      ?.getRawValue();
    const tmpArt: GebuchtesArtikelsDto = new GebuchtesArtikelsDto();
    tmpArt.artikelid = this.artikels[index].artikelId;
    tmpArt.menge = art.menge;
    tmpArt.merhwersteure = art.mehrwertsteuer;
    tmpArt.preise = art.priceNetto;
    tmpArt.artikelName = this.artikels[index].name;
    tmpArt.bestellungId = bestelungId;
    tmpArt.liferantId = Object(art).kreditorId;

    this.buchungArtikelMenge.push(tmpArt);
    this.getLieferungMstw();
    this.getLiferungBrutto();
    this.getLiferungNetto();
  }
  saveBuchung(buch: WarenBuchungDto) {
    if (buch.eingebucht === null) {
      buch.eingebucht = false;
    }

    return this.buchServi.createBestellung(buch).subscribe((data) => {
      console.log('on save buchung ' + data);
      this.getBuchungen();
    });
  }
  onSearch(text: string) {
    this.artikels = this.helper.onSearch(text, this.artikels);
  }
  artikelTrackBy(index: number, artikel: ArtikelDTO) {
    if (this.artikels === undefined) return;
    return this.artikels[index].artikelId;
  }
  showBuchungenInBearbeitung() {
    this.getBuchungen();
  }
  async getDispositors() {
    this.dispositors.splice(0, this.dispositors.length);
    await this.dispServic.getAllDispositors().subscribe((data) => {
      this.dispositors = new Array(data.length);
      for (let i = 0; i < data.length; i++) {
        this.dispositors.splice(data[i].id, 1, data[i]);
      }
      this.dispo = true;
      this.getArtikels();
    });
  }
  async getArtikelsInBuchung() {
    const bestelungId: number = this.formBuchung
      .get('bestellungId')
      ?.getRawValue();
    await this.buchServi
      .getAllArtiklesInBestellung(bestelungId)
      .subscribe((data) => {
        if (data === undefined || data.length === undefined) {
          this.show = 2;
          return;
        }
        this.buchungArtikelMenge.splice(0, this.buchungArtikelMenge.length);
        data.forEach((arti) => {
          this.artikels.every((artikel) => {
            if (arti.artikelId == artikel.artikelId) {
              const gebuchteArtikel: GebuchtesArtikelsDto =
                new GebuchtesArtikelsDto();
              gebuchteArtikel.bestellungId = arti.bestellungId;
              gebuchteArtikel.artikelid = arti.artikelId;
              gebuchteArtikel.artikelName = artikel.name;
              gebuchteArtikel.menge = arti.menge;
              gebuchteArtikel.preise = arti.priceNetto;
              gebuchteArtikel.merhwersteure = arti.mehrwertsteuer;
              gebuchteArtikel.liferantId = arti.liferantId;
              console.log(gebuchteArtikel);
              this.buchungArtikelMenge.push(gebuchteArtikel);
              return false;
            }
            return true;
          });
        });
        this.show = 2;
      });
  }
  showArtikleInBuchung() {
    this.show = 3;
  }
  goBack() {
    this.show = 2;
  }
  deleteBuchung(id: number) {
    if (this.buchngen[id].eingebucht) {
      this.toastr.error(
        'du kannst nicht löschen buchung was schön eingebucht ist!',
      );
      return;
    }
    if (
      window.confirm('Bist du sicher dass du das buchung entfernen wilsst?')
    ) {
      this.buchServi
        .deleteBestellung(this.buchngen[id].bestellungId)
        .subscribe();
      this.buchngen.splice(id, 1);
    }
  }
  deleteArtikel(id: number) {
    this.buchServi
      .deleteArtikel(
        this.buchungArtikelMenge[id].artikelid,
        this.buchungArtikelMenge[id].bestellungId,
      )
      .subscribe((data) => {
        console.log('resposne when artikel are delete from buchung ? ' + data);
        this.toastr.success('Artikel wurde entfernt', 'Entfernen', {
          timeOut: 300,
        });
        this.buchungArtikelMenge.splice(id, 1);
      });
  }
  getLiferungNetto(): number {
    let netto = 0;
    if (this.buchungArtikelMenge.length < 1) return 0;
    for (let i = 0; i < this.buchungArtikelMenge.length; i++) {
      netto +=
        this.buchungArtikelMenge[i].preise * this.buchungArtikelMenge[i].menge;
    }
    return Number(netto.toFixed(2));
  }
  getLiferungBrutto(): number {
    let brutto = 0;
    if (this.buchungArtikelMenge.length < 1) return 0;
    for (let i = 0; i < this.buchungArtikelMenge.length; i++) {
      brutto +=
        (this.buchungArtikelMenge[i].preise +
          (this.buchungArtikelMenge[i].preise *
            this.buchungArtikelMenge[i].merhwersteure) /
            100) *
        this.buchungArtikelMenge[i].menge;
    }
    return Number(brutto.toFixed(2));
  }
  getLieferungMstw() {
    let mwst = 0;
    if (this.buchungArtikelMenge.length < 1) return 0;
    for (let i = 0; i < this.buchungArtikelMenge.length; i++) {
      mwst +=
        ((this.buchungArtikelMenge[i].preise *
          this.buchungArtikelMenge[i].merhwersteure) /
          100) *
        this.buchungArtikelMenge[i].menge;
    }
    return Number(mwst.toFixed(2));
  }
  //TODO
  //controlle wenn zu viel oder zu wenig verbucht!
}
