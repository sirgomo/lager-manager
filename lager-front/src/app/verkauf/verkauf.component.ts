import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataDilerService } from '../data-diler.service';
import { DispositorDto } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { PalettenMengeVorausToDruckDto } from '../dto/paletenMengeVorausKom.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { VerkaufService } from './verkauf.service';


@Component({
  selector: 'app-verkauf',
  templateUrl: './verkauf.component.html',
  styleUrls: ['./verkauf.component.scss'],

})
export class VerkaufComponent implements OnInit {
  komiss : KomissDTO[] = new Array();
  kommStatus: typeof KOMMISIONSTATUS;
  spedi : SpeditionDto[] = new Array();
  dispo: DispositorDto[] = new Array();
  showDownload:boolean = false;
  kommissToDruck: PalettenMengeVorausToDruckDto[] = new Array();


  constructor(private serv : VerkaufService, private router : Router, private dataDie: DataDilerService, private toaster: ToastrService) {
    this.kommStatus = KOMMISIONSTATUS;

   }

  ngOnInit(): void {
    this.load();
  }
  async load(){
    this.spedi = await  this.dataDie.getSpeditors();
    this.dispo = await  this.dataDie.getDispositors();
   await this.alleKommissionierungen();
  }
  keyinenum() : Array<string> {
    var keys = Object.keys(this.kommStatus);
    return keys.slice();
}
kommStatusChange(id: number){
  //mach etwas wenn kommisionirung status geendert wurde, nur check ob arbeitet
  this.komiss.forEach((data: KomissDTO)=> {
    if(data.id == id){
      console.log('id ' + id + ' new status '+ data.kommissStatus + ' status in data ' + data.kommissStatus );
    }
  });

}

async alleKommissionierungen(){
  this.komiss.splice(0, this.komiss.length);
  this.showDownload = false;
  await this.serv.getAll().subscribe(res =>{
    res.forEach(kom =>{
      this.komiss.push(kom);
    });
  });
}

createKommissionirung(index:number){
  if(index !== -1){
    this.dataDie.setKomm(this.komiss[index]);
    this.router.navigateByUrl('verkauf/new').then();
  }else{
    this.dataDie.restetKomm();
    this.router.navigateByUrl('verkauf/new').then();
  }

}
async meinKommissionierungen(){
  this.showDownload = false;
  this.komiss.splice(0, this.komiss.length);
   await this.serv.getAllByVerkufer(Number(localStorage.getItem('myId'))).subscribe(data=>{
    data.forEach(komm =>{
      this.komiss.push(komm);
    });
   });
}
async deleteKomm(index:number){
  if(window.confirm('Bist du sicher, dass du die kommissionirung löchen wilsst?')){
    await this.serv.deleteKommissionierung(this.komiss[index].id).subscribe(data=>{
      this.komiss.splice(index, 1);
     });
    }
  }
async getKommToDruck(kommid:number){

  this.kommissToDruck.splice(0,this.kommissToDruck.length);
    await this.serv.getTotalGewichtAndPaleten(this.komiss[kommid].id).subscribe(data=>{
      if(data !== null && data.length > 0){
        for(let i =0; i !== data.length; i++){
          this.kommissToDruck.push(data[i]);
         }
         this.dataDie.setKomm(this.komiss[kommid]);
         this.showDownload = true;
      }else{
        this.toaster.error('Kommissionierung ist leer, es mussen zuerst Artikels zugefügt werden!', 'Error', {'timeOut': 800});
      }

    });

}

}
