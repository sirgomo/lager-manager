import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatenpflegeService } from './datenpflege/datenpflege.service';
import { DispositorDTO } from './dto/dispositor.dto';
import { KomissDTO } from './dto/komiss.dto';
import { SpeditionDTO } from './dto/spedition.dto';

@Injectable({
  providedIn: 'root'
})
export class DataDilerService {
  private komm :KomissDTO = new KomissDTO();
  private spedi : SpeditionDTO[] = new Array();
  private dispo: DispositorDTO[] = new Array();
  constructor( private dataServ: DatenpflegeService) {
  this.setDispo();
  this.setSpedi();

   }
public setKomm(komm:KomissDTO){
  this.komm = komm;
}
public getKomm():KomissDTO{
  return this.komm;
}
public restetKomm(){
  this.komm = new KomissDTO();
}
public getDispositors(){
  return this.dispo;
}
public getSpeditors(){
  return this.spedi;
}
private async setDispo(){
 await this.dataServ.getAllDispositors().subscribe(data=>{
    if(data !== null){
      for(let i = 0; i !== data.length; i++){
        this.dispo.push(data[i]);
      }
    }
   });
}
private async setSpedi(){
 await this.dataServ.getAllSpeditions().subscribe(data=>{
    if(data !== null){
      for(let i = 0; i !== data.length; i++ ){
        this.spedi.push(data[i]);
      }
    }
   });
}
}
