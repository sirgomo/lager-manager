import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { komissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { VerkaufService } from './verkauf.service';

@Component({
  selector: 'app-verkauf',
  templateUrl: './verkauf.component.html',
  styleUrls: ['./verkauf.component.scss']
})
export class VerkaufComponent implements OnInit {
  komiss : komissDTO[] = new Array();
  kommStatus: typeof KOMMISIONSTATUS;
  constructor(private serv : VerkaufService, private router : Router) {
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
  this.komiss.forEach((data: komissDTO)=> {
    if(data.id == id){
      console.log('id ' + id + ' new status '+ data.kommissStatus + ' status in data ' + data.kommissStatus );
    }
  })

}

alleKommissionierungen(){
  this.komiss.splice(0, this.komiss.length);
  this.serv.getAll().subscribe(res =>{
    res.forEach(kom =>{
      this.komiss.push(kom);
    });
  });
}

createKommissionirung(){
 this.router.navigateByUrl('verkauf/new').then();
}
meinKommissionierungen(){
  this.komiss.splice(0, this.komiss.length);
this.serv.getMeine().subscribe(res => {
  res.forEach(kom =>{
    this.komiss.push(kom);
  });
});
}


}
