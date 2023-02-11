import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PaleteForControlleDto } from 'src/app/dto/paleteForControlle.dto';
import { PaleteToDruckDto } from 'src/app/dto/paleteToDruck.dto';
import { PacklisteComponent } from 'src/app/print-layout/packliste.component';
import { KontrollerService } from '../kontroller.service'

@Component({
  selector: 'app-packlisten',
  templateUrl: './packlisten.component.html',
  styleUrls: ['./packlisten.component.scss']
})
export class PacklistenComponent implements OnInit{
  @Input() kommNr: number | undefined;
  palData: MatTableDataSource<PaleteForControlleDto> = new MatTableDataSource();
  columnDef : string[] = ['id', 'palettenTyp', 'kontrolliert', 'lkwNummer', 'print'];
  paletsForDruck: PaleteToDruckDto[][] = [];
  constructor(private service: KontrollerService, private toaster: ToastrService, private dialog: MatDialog) {}
  ngOnInit(): void {
   this.getPaleten();
  }
  async getPaleten() {
    if (this.kommNr === undefined) {
      this.toaster.error('Etwas ist schiefgegangen, ich Kommiessionierung number');
      return;
     }
   await this.service.getPalattenByKommId(this.kommNr).subscribe((res) => {
    if(res === null) {
      this.toaster.error('ich konnte keine Paletten finden');
    }
    this.palData = new MatTableDataSource(res);
   });
  }
  async getPaletteToDruck(palid: number) {
    if(this.kommNr === undefined) return;
  await this.service.getPaleteToDruck(palid, this.kommNr).subscribe((res) => {
    if(res === null) {
      this.toaster.error('ich konnte keine Palette finden');
    }
    
    this.paletsForDruck.splice(0, this.paletsForDruck.length);
    this.paletsForDruck.push(res);
  
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.data = this.paletsForDruck;
    conf.height = '100%';
    conf.width = '210mm';
    this.dialog.open(PacklisteComponent, conf);
  });
  }
  async getPalettenToDruck() {
    if(this.kommNr === undefined) return;
    await this.service.getPalettenToDruck(this.kommNr).subscribe((res) => {
      if(res === null) {
        this.toaster.error('ich konnte keine Palette finden');
      }
     // console.log(JSON.stringify(res));
     const tmpdata = new Set<number>();
      for(let y = 0; y < res.length; y++) {
        if(!tmpdata.has(res[y].id))
        {
          tmpdata.add(res[y].id)
        }
      }
      const data : any[] = new Array(tmpdata.size);
    
      tmpdata.forEach((v) => { 
        data[v] = [];
        for(let y = 0; y < res.length; y++) {
          if(res[y].id === v) {
            data[v].push(res[y]);
          }
        }
      });
      const data2: PaleteToDruckDto[] = data.filter((e) => {return e});
      const conf: MatDialogConfig = new MatDialogConfig();
      conf.data = data2;
      conf.height = '100%';
      conf.width = '210mm';
      this.dialog.open(PacklisteComponent, conf);
    }); 
  
  }

}
