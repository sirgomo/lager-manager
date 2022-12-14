import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SpeditionDto } from 'src/app/dto/spedition.dto';
import { DatenpflegeService } from '../datenpflege.service';
import { AddSpedition } from './addSpedition';

@Component({
  selector: 'app-speditors',
  templateUrl: './speditors.component.html',
  styleUrls: ['./speditors.component.scss']
})
export class SpeditorsComponent {
  @Input() spedi:SpeditionDto[] = new Array();
  constructor(private servi: DatenpflegeService, private dial : MatDialog, private toastr: ToastrService){}

  createNewSpeditor(){
    let conf: MatDialogConfig<SpeditionDto> = new MatDialogConfig();
    this.dial.open(AddSpedition, conf).afterClosed().subscribe(
      data=>{
        if(data !== undefined && data !== null){
          this.servi.createNewSpeditor(data).subscribe(res =>{
            if(res !== null && res.id !== undefined){
              this.spedi.push(res);
              this.toastr.success('Die Spedition wurde erstellt');
            }else{
              this.toastr.error('Etwas ist schiefgelaufen, kein antwort vom api');
            }
          });
        }else{
          this.toastr.error('Ok, es wurde Abgebrochen');
        }
      }
    )
  }
   updateSpeditor(s:SpeditionDto){
    this.servi.updateSpeditor(s, s.id);
  }
  deleteSpeditor(id:number, index : number){
     this.servi.deleteSpeditor(id);
    this.spedi.splice(index, 1);

  }
  editSpedi(id: number){
  let conf : MatDialogConfig<SpeditionDto> = new MatDialogConfig();
  conf.data = this.spedi[id];
  this.dial.open(AddSpedition, conf).afterClosed().subscribe(
    data =>{
      if(data !== undefined && data !== null){
        this.servi.updateSpeditor(data, data.id).subscribe(res =>{

          if(res !== null && res.id !== undefined){
            this.spedi[id] = res;
            this.toastr.success('Die Spedition wurde upgedated');
          }else{
            this.toastr.error('Etwas ist schiefgelaufen, kein antwort vom api');
          }
        })
      }else{
        this.toastr.error('Ok, es wurde Abgebrochen');
      }
    }
  );

  }
}
