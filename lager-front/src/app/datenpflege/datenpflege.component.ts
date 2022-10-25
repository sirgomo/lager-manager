import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { dispositorDTO } from '../dto/dispositor.dto';
import { speditionDTO } from '../dto/spedition.dto';
import { DatenpflegeService } from './datenpflege.service';

@Component({
  selector: 'app-datenpflege',
  templateUrl: './datenpflege.component.html',
  styleUrls: ['./datenpflege.component.scss']
})
export class DatenpflegeComponent implements OnInit {
  dispositors : dispositorDTO[] = new Array();
  speditors : speditionDTO[] = new Array();
  show :number = 0;

  formSpedition : FormGroup;
  formDispositors: FormGroup;

  constructor(private servi: DatenpflegeService, private fb: FormBuilder) {
    this.formDispositors = this.fb.group({
      name: [''],
      anschrift: ['']
    });
    this.formSpedition = this.fb.group({
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
createNewDispo(d : dispositorDTO){
  this.servi.createNewDispositor(d).subscribe(d =>{
    this.dispositors.push(d);
  });
  this.getAllDispositors();
}
updateDispositor(d: dispositorDTO){
  this.servi.updateDispositor(d, d.id).subscribe(d =>{
    this.dispositors.forEach(ds =>{
      if(d.id === ds.id){
        ds = d;
      }
    });
  });
}
deleteDispositor(id : number){
  this.servi.deleteDispositor(id);
  this.getAllDispositors();
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
createNewSpeditor(s: speditionDTO){
  this.servi.createNewSpeditor(s).subscribe(d =>{
    this.speditors.push(d);
  })
  this.getAllspeditiors();
}
updateSpeditor(s:speditionDTO, id:number){
  this.servi.updateSpeditor(s, id).subscribe(d =>{
    this.speditors.forEach(sped =>{
      if(sped.id === d.id){
        sped = d;
      }
    });
  });
}
deleteSpeditor(id:number){
  this.servi.deleteSpeditor(id);
  this.getAllspeditiors();
}
newSpedi(){
  this.show = 4;
}
newDispo(){
  this.show = 2;
}

}
