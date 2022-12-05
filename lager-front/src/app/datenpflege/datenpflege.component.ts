import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DispositorDto } from '../dto/dispositor.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { DatenpflegeService } from './datenpflege.service';
import { DebitorsComponent } from './debitors/debitors.component';

@Component({
  selector: 'app-datenpflege',
  templateUrl: './datenpflege.component.html',
  styleUrls: ['./datenpflege.component.scss']
})
export class DatenpflegeComponent implements OnInit {
  dispositors : DispositorDto[] = new Array();
  speditors : SpeditionDto[] = new Array();
  show :number = 0;
  @ViewChild(DebitorsComponent) dispo!: DebitorsComponent;
  formSpedition : FormGroup;


  constructor(private servi: DatenpflegeService, private fb: FormBuilder) {
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


getAllspeditiors(){
  this.show = 3;
  this.speditors.splice(0, this.speditors.length);
  return this.servi.getAllSpeditions().subscribe(data => {
    data.forEach(d => {
      this.speditors.push(d);
    });
  });
}
createNewSpeditor(s: SpeditionDto){
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
 updateSpeditor(s:SpeditionDto){
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
 this.dispo.addDispositor();

}
editSpedi(id: number){
  this.speditors.forEach(d=>{
    if(d.id === id)
      this.formSpedition.setValue({id: id, name: d.name, maxLadeGewicht: d.maxLadeGewicht, maxPalettenMenge: d.maxPalettenMenge});

  });
  this.show = 4;
}

}
