import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataFurKomisDto } from '../dto/dataFurKomis.dto';
import { KommissDetailsDto } from '../dto/kommissDetails.dto';
import { PALETTENTYP } from '../dto/lagerPlatz.dto';
import { NeuePaletteDto } from '../dto/neuePalette.dto';
import { KommisionierService } from './kommisionier.service';
import { NeupalComponent } from './neupal/neupal.component';

@Component({
  selector: 'app-kommisionier',
  templateUrl: './kommisionier.component.html',
  styleUrls: ['./kommisionier.component.scss']
})
export class KommisionierComponent implements OnInit {
  kommid :number = 0;
  currentPalatte:number = 0;
  kommDetails: DataFurKomisDto[] = new Array();
  uid :string = '';
  constructor(private kommServi: KommisionierService, private toastr: ToastrService, private dial: MatDialog) { }

  ngOnInit(): void {
    this.getLastKomm();
  }
  async getKomm(){
    await this.kommServi.getKommissionierung(this.kommid).subscribe(data=>{
      if(data !== undefined && data !== null){
        this.kommDetails.splice(0, this.kommDetails.length);
        for(let i = 0; i < data.length; i++){
          this.kommDetails.push(data[i]);
        }
        console.log(JSON.stringify(data));
      }else{
        this.toastr.error(Object(data).message);
      }
    });
  }
 getCartonMenge(index:number):string{
  let car:string = '' + Math.floor( this.kommDetails[index].menge / this.kommDetails[index].minLos);
  if(this.kommDetails[index].menge % this.kommDetails[index].minLos !== 0){
    return car + ' ' +'('+this.kommDetails[index].menge % this.kommDetails[index].minLos+')';
  }
  return car ;
 }
 async neuePalete(){
  let conf: MatDialogConfig = new MatDialogConfig();
  conf.minHeight = '100vh';
  conf.minWidth = '100vw';
  conf.panelClass = 'full-screen-modal';
  let tmpNPal : NeuePaletteDto = new NeuePaletteDto();
  tmpNPal.kommId = this.kommid;
  tmpNPal.kommissionierId = Number(localStorage.getItem('myId'));
  tmpNPal.palTyp = PALETTENTYP.EU;
  conf.data = tmpNPal;
  await this.dial.open(NeupalComponent, conf).afterClosed().subscribe(data=>{

    this.kommServi.paletteErstellen(data).subscribe(res=>{
      console.log(res);
      this.currentPalatte = res;
    });
  });
 }
 async gewichtErfassen(){
  let conf: MatDialogConfig = new MatDialogConfig();
  conf.minHeight = '100vh';
  conf.minWidth = '100vw';
  conf.panelClass = 'full-screen-modal';
  let tmpNPal : NeuePaletteDto = new NeuePaletteDto();
  tmpNPal.kommId = this.kommid;
  tmpNPal.kommissionierId = Number(localStorage.getItem('myId'));
  tmpNPal.palTyp = PALETTENTYP.EU;
  tmpNPal.palid = this.currentPalatte;
  conf.data = tmpNPal;
  await this.dial.open(NeupalComponent, conf).afterClosed().subscribe(data=>{
    if(data !== undefined && data !== '') {
      this.kommServi.gewichtErfassen(data).subscribe(res=>{
        this.currentPalatte = 0;
      });
    }
  });
 }
 async getLastKomm(){
  await this.kommServi.getLastActiveKomm(Number(localStorage.getItem('myId'))).subscribe(data=>{
    if(data !== undefined && data.length > 2){
      let tmp :string[] = String(data).split('/');
      this.kommid = Number(tmp[0]);
      this.currentPalatte = Number(tmp[1]);
      this.getKomm();
    }else{
      this.kommid = 0;
      this.currentPalatte = 0;
    }
  });
 }
 findbyuidorArtId(uid:string){
  console.log('szukam ')
  if(this.kommDetails === undefined || this.kommDetails.length === 0) return;
  for(let i = 0; i < this.kommDetails.length; i++){
    if(uid.length > 1 && isFinite(Number(uid))){
      if(Number(uid) === this.kommDetails[i].artikelId){
        console.log('hab gefunden artikel id');
      }
    }
    if(uid.length > 1){
      for(let y = 0; y < this.kommDetails[i].uids.length; y++){
        if(this.kommDetails[i].uids[y] === uid){
          console.log('hab uid gefunden');
        }
      }
    }

  }
 }
}
