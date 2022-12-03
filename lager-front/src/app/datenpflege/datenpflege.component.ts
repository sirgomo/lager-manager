import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isNumberObject } from 'util/types';
import { DispositorDTO } from '../dto/dispositor.dto';
import { SpeditionDTO } from '../dto/spedition.dto';
import { DatenpflegeService } from './datenpflege.service';

@Component({
  selector: 'app-datenpflege',
  templateUrl: './datenpflege.component.html',
  styleUrls: ['./datenpflege.component.scss']
})
export class DatenpflegeComponent implements OnInit {
  dispositors : DispositorDTO[] = new Array();
  speditors : SpeditionDTO[] = new Array();
  show :number = 0;

  formSpedition : FormGroup;
  formDispositors: FormGroup;

  constructor(private servi: DatenpflegeService, private fb: FormBuilder) {
    this.formDispositors = this.fb.group({
      id: Number,
      name: [''],
      name2: [''],
      stadt: [''],
      strasseUndNr: [''],
      postleitzahl:Number,
      uStIdentifikationsnummer: ['']
    });
    this.formSpedition = this.fb.group({
      id: Number,
      name: [''],
      maxLadeGewicht: [],
      maxPalettenMenge: []
    });
  }

  ngOnInit(): void {
   this.show = 0;
  }
getAllDispositors(){

  this.show = 1;
  this.dispositors.splice(0, this.dispositors.length);
  return this.servi.getAllDispositors().subscribe(data =>{
    if(data !== undefined && data !== null && data.length > 0){
      data.forEach(dispo => {
        this.dispositors.push(dispo);
      });
    }
    console.log('dispositors '+ JSON.stringify(data));
  });
}
createNewDispo(d : DispositorDTO){
  if(!Number.isFinite(d.id)){
  return this.servi.createNewDispositor(d).subscribe(d =>{
    this.dispositors.push(d);
    this.formDispositors.reset();
    this.getAllDispositors();
  });

}else{
 return this.updateDispositor(d);
}
}
updateDispositor(d: DispositorDTO){
  this.servi.updateDispositor(d, d.id);
  let index = this.dispositors.findIndex((e) => e.id === d.id);
  this.dispositors[index] = d;
    this.formDispositors.reset();
  this.show = 1;


}
deleteDispositor(id : number, i : number){
  console.log('delete :' + id)
  this.servi.deleteDispositor(id);

}
getAllspeditiors(){
  this.show = 3;
  this.speditors.splice(0, this.speditors.length);
  return this.servi.getAllSpeditions().subscribe(data => {
    data.forEach(d => {
      this.speditors.push(d);
    });
  });
}
createNewSpeditor(s: SpeditionDTO){
  if(!Number.isFinite(s.id)){
 return this.servi.createNewSpeditor(s).subscribe(d =>{
    this.speditors.push(d);
    this.formSpedition.reset();
    this.getAllspeditiors();
  });

}else{
 return this.updateSpeditor(s);
}
}
 updateSpeditor(s:SpeditionDTO){
  this.servi.updateSpeditor(s, s.id);
 let index = this.speditors.findIndex((e) => e.id === s.id);
 this.speditors[index] = s;
    this.formSpedition.reset();
    this.show = 3;


}
deleteSpeditor(id:number, index : number){
   this.servi.deleteSpeditor(id);
  this.speditors.splice(index, 1);

}
newSpedi(){
  this.show = 4;
}
newDispo(){
  this.show = 2;
}
editSpedi(id: number){
  this.speditors.forEach(d=>{
    if(d.id === id)
      this.formSpedition.setValue({id: id, name: d.name, maxLadeGewicht: d.maxLadeGewicht, maxPalettenMenge: d.maxPalettenMenge});

  });
  this.show = 4;
}
editDispo(id: number){
this.dispositors.forEach( d =>{
  if(d.id === id)
    this.formDispositors.setValue(d);
  });
  this.show = 2;
}
}
