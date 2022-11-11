import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataDilerService } from '../data-diler.service';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { VerkaufService } from './verkauf.service';

@Component({
  selector: 'app-verkauf',
  templateUrl: './verkauf.component.html',
  styleUrls: ['./verkauf.component.scss'],

})
export class VerkaufComponent implements OnInit {
  komiss : KomissDTO[] = new Array();
  kommStatus: typeof KOMMISIONSTATUS;

  constructor(private serv : VerkaufService, private router : Router, private dataDie: DataDilerService) {
    this.kommStatus = KOMMISIONSTATUS;
   }

  ngOnInit(): void {
   this.alleKommissionierungen();
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
  await this.serv.getAll().subscribe(res =>{
    res.forEach(kom =>{
      this.komiss.push(kom);
    });
  });
}

createKommissionirung(index:number){
  if(index !== -1){
    this.dataDie.setKomm(this.komiss[index]);
  }
 this.router.navigateByUrl('verkauf/new').then();
}
async meinKommissionierungen(){
  this.komiss.splice(0, this.komiss.length);
console.log('id '+Number(localStorage.getItem('myId')));
   await this.serv.getAllByVerkufer(Number(localStorage.getItem('myId'))).subscribe(data=>{
    data.forEach(komm =>{
      this.komiss.push(komm);
    });
   });
}


}
