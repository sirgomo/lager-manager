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
      anschrift: ['']
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
    data.forEach(dispo => {
      this.dispositors.push(dispo);
    });
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
 return this.updateDispositor(d )
}
}
updateDispositor(d: DispositorDTO){
 return this.servi.updateDispositor(d, d.id).subscribe(d =>{
    this.dispositors.forEach(ds =>{
      if(d.id === ds.id){
        ds = d;
      }
    });
    this.formDispositors.reset();
    this.getAllDispositors();
  });

}
deleteDispositor(id : number){
  console.log('delete :' + id)
  this.servi.deleteDispositor(id).subscribe( d=>{
    return this.getAllDispositors();
  });
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
  this.servi.updateSpeditor(s, s.id).subscribe(d => {
    this.speditors.forEach(sp => {
      if(d.id === sp.id)
        sp = d;
    });
    this.formSpedition.reset();
    console.log('zrobione');
     this.getAllspeditiors();
  });

}
deleteSpeditor(id:number){
  return this.servi.deleteSpeditor(id).subscribe(d =>{
    this.getAllspeditiors();
  })

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
    this.formDispositors.setValue({id: d.id, name: d.name, anschrift: d.anschrift});
  });
  this.show = 2;
}
}
