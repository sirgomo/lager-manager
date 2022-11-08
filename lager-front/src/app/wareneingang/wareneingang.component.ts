import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TruthyTypesOf } from 'rxjs';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { DispositorDTO } from '../dto/dispositor.dto';
import { LagerPlatztDto, PALETTENTYP } from '../dto/lagerPlatz.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';
import { WarenEinArtikleDto } from '../dto/warenEinArtikle.dto';
import { WareningangService } from './wareningang.service';


@Component({
  selector: 'app-wareneingang',
  templateUrl: './wareneingang.component.html',
  styleUrls: ['./wareneingang.component.scss']
})
export class WareneingangComponent implements OnInit {
  buchungen: WarenBuchungDto[] = new Array();
  dispostors: DispositorDTO[] = new Array();
  artikles: WarenEinArtikleDto[] = new Array();
  show : number = -1;
  currentLiferung :number = -1;
  currentArtikelMenge:number = 0;
  palete: boolean = false;
  mhd: Date | undefined;
  lagerPlatz : undefined | LagerPlatztDto;
  artikelIndex :number = -1;
  manualLagerPlatz: string = '';
  role:string | null;
  palettenTypEnum : typeof PALETTENTYP = PALETTENTYP;
  paletteTyp : PALETTENTYP;


  constructor(private dispoService : DatenpflegeService, private warenServi : WareningangService, private toaster: ToastrService) {
    this.role =  localStorage.getItem('role');
    this.paletteTyp = PALETTENTYP.KEINPALETTE;
  }

  ngOnInit(): void {
    this.getBuchungen();
  }
  async getBuchungen(){
    this.getDispositors();
    await this.warenServi.getAllLiferungen().subscribe(data=>{
      if(data) this.buchungen.splice(0, this.buchungen.length);
      data.forEach(buch=>{
        if(buch.eingebucht && buch.artikelsGebucht){
          this.buchungen.push(buch);
        }
      });
      this.currentLiferung = -1;
      this.show = 1;
    });
  }
  async getDispositors(){
    await this.dispoService.getAllDispositors().subscribe(data=>{
      if(data){
        this.dispostors.splice(0, this.dispostors.length);
        data.forEach(dispo=>{
        this.dispostors.push(dispo);
        });
      }
    });
  }
  async getAritkles(nr: number){
    console.log(nr);
     return await this.warenServi.getArtikles(nr).subscribe(data=>{
      this.artikles.splice(0, this.artikles.length);
      if(data != undefined){
        data.forEach(art=>{
          this.artikles.push(art);
        });
      }
      this.show = 2;
      this.currentLiferung = nr;
      this.artikelIndex = -1;
      this.mhd = undefined;
      this.paletteTyp = PALETTENTYP.KEINPALETTE;
     });

  }
  showArtikel(index:number){
    this.currentArtikelMenge = 0;
    this.palete = false;
    this.show = 3;
    this.lagerPlatz = undefined;
    this.artikelIndex = index;
    this.manualLagerPlatz = '';
  }
  async getPlatz(){
    if(this.currentArtikelMenge === 0){
      this.toaster.error('Du musst artikel menge eingeben! ', 'Menge Error', {
        timeOut: 800
      });
      return;
    } else if (this.currentArtikelMenge > this.artikles[this.artikelIndex].menge){
      this.toaster.error(' Artikel menge darft nicht größe sein als menge in auftrag');
      return;
    }
    this.lagerPlatz = new LagerPlatztDto();
   let tmp : ArtikelMengeDto = new ArtikelMengeDto();
   tmp.palete = this.paletteTyp;
   tmp.menge = this.currentArtikelMenge;
   tmp.artikelId = this.artikles[this.artikelIndex].artikelid;
   if(this.mhd !== undefined){
    tmp.mhd = this.mhd;
   }


   return await this.warenServi.getPlatz(tmp).subscribe(data=>{

      this.lagerPlatz = data;
      console.log('lager przed '+ JSON.stringify(this.lagerPlatz));
      if(this.lagerPlatz !== undefined){
        this.lagerPlatz.artikelMenge += this.currentArtikelMenge;
        if(this.lagerPlatz.artikelMenge === null){
          this.lagerPlatz.artikelMenge = this.currentArtikelMenge;
        }
        this.lagerPlatz.palettenTyp = this.paletteTyp;
        if(this.mhd !== undefined){
          this.lagerPlatz.mhd = this.mhd;
         }
         this.lagerPlatz.artId = this.artikles[this.artikelIndex].artikelid;
         console.log('lagerplatz aft ' + JSON.stringify(this.lagerPlatz));
      }

    });
  }
  createPlatz(){
    if(this.currentArtikelMenge === 0){
      this.toaster.error('Du musst artikel menge eingeben! ', 'Menge Error', {
        timeOut: 800
      });
      return;
    }  else if (this.currentArtikelMenge > this.artikles[this.artikelIndex].menge){
      this.toaster.error(' Artikel menge darft nicht größe sein als menge in auftrag');
      return;
    }
    this.lagerPlatz = new LagerPlatztDto();
    this.manualLagerPlatz = 'gib ein lagerpaltz oder beschreibe es, zb. and der wand'
    let tmp : LagerPlatztDto = new LagerPlatztDto();
    tmp.artId = this.artikles[this.artikelIndex].artikelid;
    tmp.artikelMenge = this.artikles[this.artikelIndex].menge;
    if(this.mhd !== undefined) tmp.mhd = this.mhd;
    tmp.lagerplatz = this.manualLagerPlatz;
    tmp.palettenTyp = this.paletteTyp;
    tmp.static = true;
    this.lagerPlatz = tmp;

    console.log(tmp);
  }
  async lageEsEin(){
    if(this.lagerPlatz !== undefined){
       await this.warenServi.legeEs(this.lagerPlatz).subscribe(data=>{
        if(data.artId == this.artikles[this.artikelIndex].artikelid){
          if(this.lagerPlatz !== undefined)
          if(this.currentArtikelMenge === this.artikles[this.artikelIndex].menge){
            this.delArtikel(data);
          }else{
            let tmp: WarenEinArtikleDto = new WarenEinArtikleDto();
            tmp.artikelid = this.artikles[this.artikelIndex].artikelid;
            tmp.bestellungId = this.artikles[this.artikelIndex].bestellungId;
            tmp.menge = this.currentArtikelMenge;
            this.artikles[this.artikelIndex].menge -= this.currentArtikelMenge;
            this.warenServi.updateArtikel(tmp).subscribe(data=>{
              console.log(data);
            })
            this.show = 2;
            this.artikelIndex = -1;
            this.mhd = undefined;
            this.paletteTyp = PALETTENTYP.KEINPALETTE;
            this.currentArtikelMenge = 0;
          }

        }
      });
    }

  }
  async delArtikel(data: LagerPlatztDto){

    await  this.warenServi.delArtikel(this.artikles[this.artikelIndex].artikelid, this.artikles[this.artikelIndex].bestellungId)
     .subscribe(data=>{
       this.artikles.splice(this.artikelIndex, 1);
       if(this.artikles.length === 0){
        this.getBuchungen();
       }
       this.show = 2;
       this.artikelIndex = -1;
       this.mhd = undefined;
       this.paletteTyp = PALETTENTYP.KEINPALETTE;
       this.currentArtikelMenge = 0;
     });

   }

}
