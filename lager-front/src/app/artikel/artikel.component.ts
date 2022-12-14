import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataDilerService } from '../data-diler.service';
import { ArtikelDTO, ARTIKELFLAGE } from '../dto/artikel.dto';
import { UidDTO } from '../dto/artikel.dto';
import { DispositorDto } from '../dto/dispositor.dto';
import { HelperService } from '../helper.service';
import { ArtikelService } from './artikel.service';

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss']
})
export class ArtikelComponent implements OnInit {
  artikels: ArtikelDTO[] = new Array();
  artikel: ArtikelDTO = new ArtikelDTO();
  liferants: DispositorDto[] = new Array();
  formArtikel: FormGroup;
  //tmp array for uids of edited artikel
  uids : UidDTO[] = new Array();
  index: number;
   searchModel : string = '';
   public artikelFlags = Object.values(ARTIKELFLAGE);


  show : number = 1;
  constructor(private servi : ArtikelService, private fb : FormBuilder, private helper: HelperService, private toaster: ToastrService, private dataServ : DataDilerService) {
     this.formArtikel = this.fb.group({
    aid : Number,
    artikelId : Number,
    name: [''],
    name2: [''],
    uids: [''],
    longBeschriftung: [''],
    gewicht: Number,
    grosse: [''],
    basisEinheit: Number,
    minLosMenge: Number,
    bestand: Number,
    artikelFlage: ARTIKELFLAGE,
    verPrice2: Number,
    verPrice: Number,
    mehrwertsteuer: Number,
    liferantId:Number
   });
   //artikel index 0.1 if new or index
   this.index = 0.1;
  }

  ngOnInit(): void {
    this.getLiferants();

  }
  async getArtikles(){
    this.show  = 1;
    this.artikels.splice(0,this.artikels.length);
    return await this.servi.getAllArtikel().subscribe(d => {
   d.map(da =>{
    this.artikels.push(da);
    });
   });
  }
  async getLiferants(){

   this.liferants = await this.dataServ.getDispositors();
      if(this.liferants.length > 0){
        this.getArtikles();
      }
  }
  async getArtikelById(id:number, index:number){
    this.index = index;
     await  this.servi.getArtikelById(id).subscribe(d =>{
      console.log(d);
      this.artikel = d;
      let uids : string  = '';
      //tmp uids for edition purpose
      if(d.uids.length ){
        this.uids.splice(0,uids.length);
        this.uids = d.uids;

      this.artikel.uids.forEach(da => {
            if(!uids && uids.length < 2){
              uids =  da.uid;
            }else{
              uids += ',' + da.uid;
            }
      });
    }
    uids.trim();
      this.formArtikel.reset();
      this.formArtikel.patchValue(this.artikel);
      this.formArtikel.patchValue({'uids' : uids});
      this.show = 2;
      });
  }
  updateArtikle(art: ArtikelDTO){
    let uids :string = this.formArtikel.get<string>('uids')?.value;
    let uidss : string[] = uids.trim().split(',');
    let tmpUid: UidDTO[] = new Array();
    if(uidss.length >= 1){

      for(let i = uidss.length; i > 0; i--){
        if(this.uids.length > 0){
          if(uidss.length > this.uids.length){
            let a = new UidDTO();
            a.uid = uidss[i-1]
            a.artikelId = art.artikelId;
            tmpUid.push(a);
            uidss.splice(i-1,1);
          }else {
            this.uids[i-1].uid = uidss[i-1];
            this.uids[i-1].artikelId = art.artikelId;
            tmpUid.push(this.uids[i-1]);
            this.uids.splice(i-1,1);
            uidss.splice(i-1,1);
          }
      }else{
        let a = new UidDTO();
        a.uid = uidss[i]
        a.artikelId = art.artikelId;
        tmpUid.push(a);
      }

      }

    }else{
      tmpUid = [];
    }

    art.uids = tmpUid;
    //TODO still not working, needs refactoring!
    this.servi.updateArtikel(art).subscribe(data=>{
    if(data !== null){
      this.toaster.success('Artikel wurde geändert : ' + data.artikelId, 'Artikel Ändern', {timeOut: 700});
      this.artikels[this.index] = art;
      this.show =1;
    }
  });
  }
  createUpdateArtikel(art : ArtikelDTO){
    this.searchModel = '';
      let lUid : UidDTO[] = new Array();

        let uids :string = this.formArtikel.get<string>('uids')?.value;
        let uidss : string[] = uids.split(',');
      if(uids.length > 3){
        uidss.forEach( uid => {
          let a = new UidDTO();
          a.uid = uid;
          a.artikelId = art.artikelId;
          lUid.push(a);
        });
        art.uids = lUid;
      }else{
        art.uids = [];
      }

      this.servi.createArtikel(art).subscribe(data=>{
        if(data !== null){
          this.toaster.success('Artikel zugefukt on id : ' + data.artikelId, 'Artikel zufugen', {timeOut: 700});
          this.artikels.push(art);
        }
      });


  }
  newArtikel(){
    this.artikel = new ArtikelDTO();
    this.formArtikel.reset();
    this.index = 0.1;
    this.show = 2;
  }
  onSearch(text:string){
   this.artikels = this.helper.onSearch(text, this.artikels);
  }
  artikelTrackBy(index :number, artik: ArtikelDTO){

    try{
    return artik.artikelId;
    }catch(err){
    return  console.log(err);
    }
  }
  deleteArtikel(id: number, index : number){
    if(window.confirm('Bist du sicher dass du den Artikel löschen willst')){
      this.servi.deleteArtikel(id).subscribe(d=> {
        if(d){
          this.artikels.splice(index, 1);
        }
      });
    }

  }
}
