import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ArtikelService } from '../artikel/artikel.service';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { ArtikelDTO } from '../dto/artikel.dto';
import { BestArtikelMengeDto } from '../dto/bestArtikelMenge.dto';
import { DispositorDto } from '../dto/dispositor.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';
import { HelperService } from '../helper.service';
import { WarenBuchungService } from './warenbuchung.service';

@Component({
  selector: 'app-warenebuchung',
  templateUrl: './warenebuchung.component.html',
  styleUrls: ['./warenebuchung.component.scss']
})
export class WarenebuchungComponent implements OnInit {
  isNaN: Function = isNaN;
  buchngen : WarenBuchungDto[] = new Array();
  buchung : WarenBuchungDto = new WarenBuchungDto();
  formBuchung : FormGroup;
  show: number = 1;
  searchModel : string = '';
  artikels :ArtikelDTO[] = new Array();
  artikelMenge : number[] = new Array(this.artikels.length);
  dispositors : DispositorDto[] = new Array();
  dispo : boolean = false;
  nettoArr: number[] = new Array(this.artikels.length);
  steuArr: number[] = new Array(this.artikels.length);



  buchungArtikelMenge = new Array();



  constructor(private buchServi : WarenBuchungService, private fb: FormBuilder, private helper: HelperService,
     private artService : ArtikelService, private dispServic : DatenpflegeService, private toastr: ToastrService) {
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
      mehrwertsteuer: Number
    });

  }

  ngOnInit(): void {
    this.getBuchungen();
    this.getArtikels();

  }
   async getBuchungen(){
    this.getDispositors();
    this.buchngen.splice(0, this.buchngen.length);
     await  this.buchServi.getAllBuchungen().subscribe(data =>{

        data.forEach(buchung =>{
          if(!buchung.eingebucht){
            this.buchngen.push(buchung);
          }
        });
        this.show = 1;
      });
  }
  async getArtikels(){
    this.artikels.splice(0, this.artikels.length);
    await this.artService.getAllArtikel().subscribe(data => {
      data.forEach(art =>{
        this.artikels.push(art);
      });

    });
  }
  getBrutto(i:number){
    return '' + (this.nettoArr[i] + (this.nettoArr[i] * this.steuArr[i] / 100));
  }
  async createBuchung(){
    this.formBuchung.reset();
    this.show = 2;
  }
  bearbeiteBuchung(id :number){
    this.formBuchung.reset();
    this.formBuchung.setValue(this.buchngen[id]);
    this.show = 2;
  }
  addArtikel( artikelid:number, menge :number, index: number){
    let bestelungId :number  = this.formBuchung.get('bestellungId')?.getRawValue();
    if(bestelungId === null){
      this.toastr.error('Das Buchung muss zuerst gespeichert werden !');
      return;
    }
    if(!isFinite( this.steuArr[index]) && !isFinite( this.nettoArr[index])){
      this.toastr.error('Du musst den Preise und Mehrwerhsteure eingeben')
      return;
    }
    this.artikelMenge.splice(0, this.artikelMenge.length);
    let bucharti : BestArtikelMengeDto = new BestArtikelMengeDto();
    bucharti.artikelId = artikelid;
    bucharti.bestellungId = bestelungId;
    bucharti.menge = menge;
    bucharti.mehrwertsteuer = this.steuArr[index];
    bucharti.priceNetto = this.nettoArr[index];
    this.buchServi.addArtikel(bucharti).subscribe(data=>{
      if(data) this.toastr.success('Artikel zugefugt', 'Artikel', {timeOut: 400});
    });
  }
  saveBuchung(buch : WarenBuchungDto){
    if(buch.eingebucht === null){
      buch.eingebucht = false;
    }

   return this.buchServi.createBestellung(buch).subscribe(data=>{
    this.getBuchungen();
   });
  }
  onSearch(text: string){
    this.artikels = this.helper.onSearch(text, this.artikels);
  }
  artikelTrackBy(index : number, artikel: ArtikelDTO){
    if(this.artikels === undefined) return;
    return this.artikels[index].artikelId;
  }
  showBuchungenInBearbeitung(){
    this.getBuchungen();
  }
  async getDispositors(){
    this.dispositors.splice(0,this.dispositors.length);
    await this.dispServic.getAllDispositors().subscribe(data => {
      data.forEach(dis => {
        this.dispositors.push(dis);
      });
      this.dispo = true;
    });

  }
  async getArtikelsInBuchung(){
    let bestelungId :number  = this.formBuchung.get('bestellungId')?.getRawValue();
    await this.buchServi.getAllArtiklesInBestellung(bestelungId)
    .subscribe(data =>{
      if(data === undefined || data.length === undefined) return;
      this.buchungArtikelMenge.splice(0, this.buchungArtikelMenge.length);
      data.forEach(arti => {
        this.artikels.every( artikel =>{
          if(arti.artikelId == artikel.artikelId){
           let gebuchteArtikel = {'bestellungId'  : 0 ,'artikelid' : 0  ,'artikelName' : '', 'menge' : 0 };
            gebuchteArtikel.bestellungId = arti.bestellungId;
            gebuchteArtikel.artikelid = arti.artikelId;
            gebuchteArtikel.artikelName = artikel.name;
            gebuchteArtikel.menge = arti.menge;
            this.buchungArtikelMenge.push(gebuchteArtikel);
            return false;
          }
          return true;
        });
      });

      this.show = 3;
    });

  }
  goBack(){
    let bestelungId :number  = this.formBuchung.get('bestellungId')?.getRawValue();
    this.show = 2;
  }
  deleteBuchung(id: number){
    if(this.buchngen[id].eingebucht){
      this.toastr.error('du kannst nicht löschen buchung was schön eingebucht ist!');
      return;
    }
    if(window.confirm('Bist du sicher dass du das buchung entfernen wilsst?')){
     this.buchServi.deleteBestellung(this.buchngen[id].bestellungId).subscribe();
     this.buchngen.splice(id, 1);
    }
  }
  deleteArtikel(id:number){
    this.buchServi.deleteArtikel(this.buchungArtikelMenge[id].artikelid, this.buchungArtikelMenge[id].bestellungId).subscribe(data=>{
      this.toastr.success('Artikel wurde entfernt', 'Entfernen', {timeOut : 300});
      this.buchungArtikelMenge.splice(id, 1);
    });
  }
  //TODO
  //controlle wenn zu viel oder zu wenig verbucht!
}
