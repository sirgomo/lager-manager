
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DispositorDto } from 'src/app/dto/dispositor.dto';
import { DatenpflegeService } from '../datenpflege.service';
import { AddDebitorComponent } from './add-debitor.component';

@Component({
  selector: 'app-debitors',
  templateUrl: './debitors.component.html',
  styleUrls: ['./debitors.component.scss']
})
export class DebitorsComponent implements OnInit{
  @Input() dispositors: DispositorDto[] = new Array();
  constructor(private serv: DatenpflegeService, private toastr :ToastrService, private matDialg : MatDialog){

  }
  ngOnInit(): void {

  }
   addDispositor(){
    let conf :MatDialogConfig = new MatDialogConfig();
    conf.width = '70%';

     this.matDialg.open(AddDebitorComponent, conf).afterClosed().subscribe(
     data=>{
       if(data !== undefined && data.name.length > 2){
         this.serv.createNewDispositor(data).subscribe(dispo=>{
           if(dispo !== null && dispo !== undefined && dispo.id !== null)
           this.dispositors.push(dispo);
         });
       }
       });


  }
  editDispo(index: number){
    let conf :MatDialogConfig = new MatDialogConfig();
    conf.width = '70%';
    for(let i = 0; i < this.dispositors.length; i++){
      if(this.dispositors[i].id === index){
        conf.data = this.dispositors[i];
      }
    }

     this.matDialg.open(AddDebitorComponent, conf).afterClosed().subscribe(
     data=>{
      for(let i = 0; i < this.dispositors.length; i++){
        if(data !== undefined && data.id !== null &&  this.dispositors[i].id === data.id){
         if(this.dispositors[i] !== data){
          this.serv.createNewDispositor(data).subscribe(dispo=>{
            if(dispo !== null && dispo !== undefined && dispo.id !== null)
            this.dispositors[i] = dispo;
          });
         }
        }
      }
    });
  }
  deleteDispositor(id:number, index:number){
    this.dispositors.splice(index,1);
    this.serv.deleteDispositor(id);
  }
}
