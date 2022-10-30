import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArtikelDTO, artikelFlage } from '../dto/artikel.dto';
import { UidDTO } from '../dto/artikel.dto';
import { ArtikelService } from './artikel.service';

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss']
})
export class ArtikelComponent implements OnInit {
  artikels: ArtikelDTO[] = new Array();
  artikel: ArtikelDTO = new ArtikelDTO();
  formArtikel: FormGroup;
  //tmp array for uids of edited artikel
  uids : UidDTO[] = new Array();
  index: number;
   searchModel : string = '';


  show : number = 1;
  constructor(private servi : ArtikelService, private fb : FormBuilder) {
     this.formArtikel = this.fb.group({
    artikelId : Number,
    name: [''],
    uids: [''],
    gewicht: Number,
    grosse: [''],
    basisEinheit: Number,
    minLosMenge: Number,
    bestand: Number,
    artikelFlage: artikelFlage,
    artikelPrice: Number
   });
   //artikel index 0.1 if new or index
   this.index = 0.1;
  }

  ngOnInit(): void {
   this.getArtikles();
  }
  getArtikles(){
    this.show  = 1;
    return  this.servi.getAllArtikel().subscribe(d => {
   d.map(da =>{
    this.artikels.push(da);
    });
   });
  }
  async getArtikelById(id:number, index:number){

    this.index = index;
    this.show = 2;
    this.uids.splice(0, this.uids.length);
     await  this.servi.getArtikelById(id).subscribe(d =>{
      this.artikel = d;
      let uids : string  = '';
      //tmp uids for edition purpose
      if(d.uids.length){
        this.uids = d.uids;
        console.log(JSON.stringify(this.uids));


      this.artikel.uids.forEach(da => {
            if(!uids && uids.length < 2){
              uids =  da.uid;
            }else{
              uids += ' , ' + da.uid;
            }
      });
    }
      this.formArtikel.reset();
      this.formArtikel.patchValue(this.artikel);
      this.formArtikel.patchValue({'uids' : uids});
      });
  }
  createUpdateArtikel(art : ArtikelDTO){
    if( this.index === 0.1){

      let lUid : UidDTO[] = new Array();

        let uids :string = this.formArtikel.get<string>('uids')?.value;
        let uidss : string[] = uids.split(',');
      if(uids.length > 3){
        uidss.forEach( uid => {
          let a = new UidDTO();
          a.uid = uid;
          lUid.push(a);
        });
        art.uids = lUid;
      }else{
        art.uids = [];
      }
      this.servi.createArtikel(art).subscribe();
    }else{
      let uids :string = this.formArtikel.get<string>('uids')?.value;
      let uidss : string[] = uids.split(',');
      if(uids.length > 3){
        if(this.uids.length >= uidss.length){
          for(let i = 0; i < this.uids.length; i++){
            if(i <= uidss.length -1){
             this.uids[i].uid = uidss[i];
            }else{
              this.uids.splice(i,1);
            }
          }
        }else{

          let i = 0;
          while(uidss.length > this.uids.length){
            let tmpUip: UidDTO = new UidDTO();
            tmpUip.artikelId = this.artikel.artikelId;
            tmpUip.uid = uidss[uidss.length -1 - i];
            i++;
            this.uids.push(tmpUip);
          }

        }
      }else{
        this.uids.splice(0, this.uids.length);
      }
      art.uids = this.uids;
      this.artikels[this.index] = art;
    this.servi.createArtikel(art).subscribe();
    }

  }
  newArtikel(){
    this.formArtikel.reset();
    this.index = 0.1;
    this.show = 2;
  }
    onSearch(text : string){
     let tmpArrNew : ArtikelDTO[] = new Array();
     let y = 0;


     try{

    for (let o = 0; o < this.artikels.length; o++) {


         let tmpArr = Array.from(text);
         let tmpArr1 = Array.from(this.artikels[o].name);

         let atmp: number = 0;

         for (let i = 0; i < tmpArr.length; i++) {
           if (tmpArr[i].toLocaleLowerCase().trim() == tmpArr1[i].toLocaleLowerCase().trim()) {
             atmp += 1;

           }
         }

         if (atmp == tmpArr.length && tmpArrNew[0] == undefined ) {


            tmpArrNew.push(this.artikels[o]);
            this.artikels.splice(o, 1);
        }
        if(isFinite(Number(text))){
          if(isFinite(Number(text)) && this.artikels[o].artikelId === Number(text)){
            tmpArrNew.push(this.artikels[o]);
            this.artikels.splice(o, 1);
          }
        }

       }




    }catch(err){
      console.log(err);
    }

      tmpArrNew.forEach(d => {
        this.artikels.unshift(d);
      })

  }
  artikelTrackBy(index :number, artik: ArtikelDTO){

    try{
    return artik.artikelId;
    }catch(err){
    return  console.log(err);
    }
  }
  deleteArtikel(id: number, index : number){
    this.servi.deleteArtikel(id).subscribe(d=> {
      if(d){
        this.artikels.splice(index, 1);
      }
    });
  }
}
