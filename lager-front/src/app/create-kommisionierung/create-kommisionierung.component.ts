import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataDilerService } from '../data-diler.service';
import { AddArtikelKommissDto } from '../dto/addArtikelKommiss.dto';
import { ArtikelKommissDto } from '../dto/artikelKommiss.dto';
import { DispositorDTO } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { ARTIKELSTATUS, KommissDetailsDto } from '../dto/kommissDetails.dto';
import { SpeditionDTO } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { VerkaufService } from '../verkauf/verkauf.service';

@Component({
  selector: 'app-create-kommisionierung',
  templateUrl: './create-kommisionierung.component.html',
  styleUrls: ['./create-kommisionierung.component.scss']
})
export class CreateKommisionierungComponent implements OnInit {
  kommissForm: FormGroup;
  verkaufer: number = Number(localStorage.getItem('myId'));
  readonly kommStatus : typeof KOMMISIONSTATUS = KOMMISIONSTATUS ;
  dispo: DispositorDTO[] = new Array();
  spedi: SpeditionDTO[] = new Array();
  spediSelected: number = -1;
  searchModel: string = '';
  artikels : ArtikelKommissDto[] = new Array();
  artikelMenge: number[] = new Array();
  artikelMengeEdit: number[] = new Array();
  artikelsInKomm: ArtikelKommissDto[] = new Array();
  artikelStatus: string[] = new Array();
  showArtikelsInKomm :number = 0;
  currentKomm : KomissDTO = new KomissDTO();
  constructor(private kommServ: VerkaufService, private fb : FormBuilder
    ,private helper: HelperService, private dataDiel : DataDilerService, private router: Router, private toastr: ToastrService) {
    this.kommissForm = this.fb.group({
      id: Number,
      verkauferId: Number,
      maxPalettenHoher: Number,
      gewunschtesLieferDatum: Date,
      dispositorId: Number,
      kommissStatus: KOMMISIONSTATUS,
      spedition: Number,
      versorungId: [''],
      kommDetails: KommissDetailsDto
    });
    this.kommStatus = KOMMISIONSTATUS;

   }

  ngOnInit(): void {
    this.spedi = this.dataDiel.getSpeditors();
    this.dispo = this.dataDiel.getDispositors();
    this.getArtikle();
  }

  async getArtikle(){
    //how many artikels are aviable ?
    // total menge on lager - menge in reservation entity - das was fehlt
    this.artikels.splice(0, this.artikels.length);
    await this.kommServ.getArtikles().subscribe(data=>{
      for(let i = 0; i !== data.length; i++){
        let tmp : ArtikelKommissDto = new ArtikelKommissDto();
        Object.assign(tmp, data[i]);
        if(tmp.resMenge !== null){
          tmp.total -= data[i].resMenge;
        }
        if(tmp.fehlArtikelMenge !== null){
          tmp.total -= data[i].fehlArtikelMenge;
        }
        this.artikels.push(tmp);
      }
      this.getKommFromKommponent();
    });
  }
  onSearch(text:string){
   this.artikels = this.helper.onSearchK(text, this.artikels);
  }
  artikelTrackBy(index:number){
    if(this.artikels !== undefined && this.artikels.length > 0){
      return this.artikels[index].artId;
    }
    return;
  }
  async checkVerfurbarkeit(index:number){
   await this.kommServ.getCurrentVerfugbareMenge(this.artikels[index].artId).subscribe(
    data =>{
     let tmp : ArtikelKommissDto = new ArtikelKommissDto();
     Object.assign(tmp, data);

      if(tmp.resMenge !== null){
        tmp.total -= data.resMenge;
      }
      if(data.fehlArtikelMenge !== null){
        tmp.total -= data.fehlArtikelMenge;
      }
      this.artikels[index].total  = tmp.total;
    });

  }
  async saveKommissionierung(komm : KomissDTO){
   return this.kommServ.createKommissionierung(komm).subscribe(data=>{
    this.router.navigateByUrl('verkauf').then();
    });
  }
  getKommFromKommponent(){

    this.currentKomm = this.dataDiel.getKomm();
    this.reasignKomm();
  }
  reasignKomm(){
    if(this.currentKomm.id !== undefined && this.currentKomm.id !== 0){
      this.kommissForm.reset();
      this.artikelsInKomm.splice(0, this.artikelsInKomm.length);

      this.kommissForm.setValue(this.currentKomm);
      this.kommissForm.get('gewunschtesLieferDatum')?.setValue(new Date(this.currentKomm.gewunschtesLieferDatum).toISOString().split('T')[0]);
      this.spediSelected = this.kommissForm.get('spedition')?.getRawValue();
      this.kommissForm.get('spedition')?.valueChanges.subscribe(data=>{ this.spediSelected = data});
      for(let y = 0; y !== this.currentKomm.kommDetails.length; y++){
        for(let i = 0; i !== this.artikels.length; i++){
         if(this.currentKomm.kommDetails[y].artikelId === this.artikels[i].artId){
          let tmpArti : ArtikelKommissDto = new ArtikelKommissDto();
          Object.assign(tmpArti, this.artikels[i]);
          tmpArti.total = this.currentKomm.kommDetails[y].menge;
          this.artikelsInKomm.push(tmpArti);
          tmpArti = this.setDetailsOfArtikel(tmpArti);
          this.artikelStatus[y] = this.currentKomm.kommDetails[y].gepackt;
          break;
         }
        }
      }


    }else{
      this.kommissForm.reset();
      this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
      this.kommissForm.get('kommissStatus')?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
      this.kommissForm.get('spedition')?.valueChanges.subscribe(data=>{ this.spediSelected = data});
    }
  }
  newKomm(){
    this.kommissForm.reset();
      this.kommissForm.get('verkauferId')?.setValue(this.verkaufer);
      this.kommissForm.get('kommissStatus')?.setValue(KOMMISIONSTATUS.INBEARBEITUNG);
      this.kommissForm.get('spedition')?.valueChanges.subscribe(data=>{ this.spediSelected = data});
  }
  setDetailsOfArtikel(tmpArti : ArtikelKommissDto){
    let totalkartons : number = Math.floor( tmpArti.total / tmpArti.minLosMenge);
    tmpArti.gewicht = totalkartons * tmpArti.gewicht;
    return tmpArti;

  }
async addArtikelToKomm(index:number, edit:boolean){
  let art: AddArtikelKommissDto[] = new Array();
  if(!edit && this.artikelMenge[index] > this.artikels[index].total)
  {
    let tmp : number = this.artikelMenge[index] - this.artikels[index].total;
    this.artikelMenge[index] = this.artikels[index].total;
   if(window.confirm('Wir können nur ' + this.artikels[index].total + ' lifern, soll ' + tmp + ' bestellt werden ?'))
    {
      let tmpart: AddArtikelKommissDto = new AddArtikelKommissDto();
      if(edit){
        tmpart.artikelId = this.artikelsInKomm[index].artId;
        tmpart.kommDeatailnr = this.currentKomm.kommDetails[index].id;
      }else{
        tmpart.artikelId = this.artikels[index].artId;
      }

      if(tmp % this.artikels[index].minLosMenge !== 0){
        tmp += this.artikels[index].minLosMenge -( tmp % this.artikels[index].minLosMenge);
      }
      tmpart.kommNr = Number( this.kommissForm.get('id')?.getRawValue());
      tmpart.artMenge = tmp;
      tmpart.inBestellung = true;
      let artForLocal: ArtikelKommissDto = new ArtikelKommissDto();
      for(let i = 0; i!== this.artikels.length; i++){
        if(tmpart.artikelId === this.artikels[i].artId){
          Object.assign(artForLocal, this.artikels[i]);
          artForLocal.total = tmpart.artMenge;
          this.artikelsInKomm.push(artForLocal);
          break;
        }
      }
     art.push(tmpart);

    }else{
      this.toastr.show(' ok, keine andreungen!', '', {timeOut: 800});
      return;
    }
  }
  if(edit && this.artikelMengeEdit[index] > 0 && this.artikelMengeEdit[index] > this.artikelsInKomm[index].total)
  {
    for(let i = 0; i !== this.artikels.length; i++){
      if(this.artikelsInKomm[index].artId === this.artikels[i].artId){
        if(this.artikelMengeEdit[index] > this.artikels[i].total + this.artikelsInKomm[index].total){
          let tmp : number = this.artikelMengeEdit[index] - this.artikels[i].total;
          this.artikelMengeEdit[index] = this.artikels[i].total;
          if(window.confirm('Wir können nur ' + this.artikels[i].total + ' lifern, soll ' + tmp + ' bestellt werden ?'))
          {
            let tmpart: AddArtikelKommissDto = new AddArtikelKommissDto();
              tmpart.artikelId = this.artikelsInKomm[index].artId;
              this.currentKomm.kommDetails[index].id = -1;
            if(tmp % this.artikels[i].minLosMenge !== 0){
              tmp += this.artikels[i].minLosMenge -( tmp % this.artikels[i].minLosMenge);
            }
            tmpart.kommNr = Number( this.kommissForm.get('id')?.getRawValue());
            tmpart.artMenge = tmp;
            tmpart.inBestellung = true;
            let artForLocal: ArtikelKommissDto = new ArtikelKommissDto();
             Object.assign(artForLocal, this.artikels[i]);
             artForLocal.total = tmpart.artMenge;
             this.artikelsInKomm.push(artForLocal);


           art.push(tmpart);

          }else{
            this.toastr.show(' ok, keine andreungen!', '', {timeOut: 800});
            return;
          }
        }
        break;
      }
    }



  }


  if(!edit && this.artikelMenge[index] > 0 ){

    if(this.artikelMenge[index] % this.artikels[index].minLosMenge !== 0 && this.artikelMenge[index] !== this.artikels[index].total){
        if(!window.confirm('Willst du Anbruch schicken ?')){
          this.artikelMenge[index] += this.artikels[index].minLosMenge -( this.artikelMenge[index] % this.artikels[index].minLosMenge);
        return;
        }
    }
      let artToAd : AddArtikelKommissDto = new AddArtikelKommissDto();
        artToAd.artMenge = this.artikelMenge[index];
        artToAd.artikelId = this.artikels[index].artId;
        artToAd.kommNr = Number( this.kommissForm.get('id')?.getRawValue());
      let tmpArt: ArtikelKommissDto = new ArtikelKommissDto();
        Object.assign(tmpArt, this.artikels[index]);
        tmpArt.total = this.artikelMenge[index];
        this.artikels[index].total -= this.artikelMenge[index];
        this.artikelsInKomm.push(tmpArt);
        this.artikelMenge[index] = 0;
     art.push(artToAd);


  }else{
      if(this.artikelMengeEdit[index] > 0){
      if(this.artikelMengeEdit[index] % this.artikels[index].minLosMenge !== 0 && this.currentKomm.kommDetails[index].id !== -1){
        if(!window.confirm('Willst du Anbruch schicken ?')){
          this.artikelMengeEdit[index] += this.artikels[index].minLosMenge -( this.artikelMengeEdit[index] % this.artikels[index].minLosMenge);
          return;
        }
      }
      let artToAd : AddArtikelKommissDto = new AddArtikelKommissDto();
      artToAd.artikelId = this.artikelsInKomm[index].artId;
      artToAd.kommNr = Number( this.kommissForm.get('id')?.getRawValue());
      artToAd.kommDeatailnr = this.currentKomm.kommDetails[index].id;
      if(this.currentKomm.kommDetails[index].id !== -1){
        artToAd.artMenge = this.currentKomm.kommDetails[index].menge;

        if(artToAd.artMenge > this.artikelMengeEdit[index]){
          artToAd.artMenge = -(artToAd.artMenge - this.artikelMengeEdit[index]);
          this.artikelsInKomm[index].total += artToAd.artMenge;
        }else{
          artToAd.artMenge = this.artikelMengeEdit[index] - artToAd.artMenge;
          this.artikelsInKomm[index].total += artToAd.artMenge;
        }
      }else{
        artToAd.artMenge = this.artikelMengeEdit[index];
      }


      art.push(artToAd);
      this.artikelMengeEdit[index] = 0;
    }
  }
  art.reverse();
  console.log(JSON.stringify(art));
  this.saveArtikel(art);
}
async saveArtikel(art:AddArtikelKommissDto[]){
return  await this.kommServ.addArtikelToKomm(art).subscribe((data)=>{
    if(data !== null){
      Object.assign(this.currentKomm, data[data.length-1]);
      this.reasignKomm();
    }
  }, (err)=>{
    console.log(err.message);
  });
}
showArtikelsinKomm(){
  if(this.showArtikelsInKomm === 0){
    this.showArtikelsInKomm =1;
  }else{
    this.showArtikelsInKomm = 0;
  }
}
deletePositionInKomm(index:number){
  this.kommServ.deletePosInKom(this.currentKomm.kommDetails[index].id).subscribe(
    data=>{
      console.log(data);
      if(data == 1){
        for(let i = 0; i !== this.artikels.length; i++){
          if(this.currentKomm.kommDetails[index].artikelId === this.artikels[i].artId){
            this.artikels[i].total += this.currentKomm.kommDetails[index].menge;
          }
        }
        this.currentKomm.kommDetails.splice(index,1);
        this.reasignKomm();
      }
    });
}
}
