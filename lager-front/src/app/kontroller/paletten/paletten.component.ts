import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PALETTENTYP } from 'src/app/dto/lagerPlatz.dto';
import { PaleteForControlleDto } from 'src/app/dto/paleteForControlle.dto';
import { KontrollerService } from '../kontroller.service';
import { PalControlComponent } from '../pal-control/pal-control.component';
import { PalgewichtComponent } from '../palgewicht/palgewicht.component';

@Component({
  selector: 'app-paletten',
  templateUrl: './paletten.component.html',
  styleUrls: ['./paletten.component.scss'],
})
export class PalettenComponent implements OnInit, OnDestroy {
  @Input() kommNr = 0;
  paletten: PaleteForControlleDto[][] = [];
  dataRes: MatTableDataSource<PaleteForControlleDto> = new MatTableDataSource();
  columnDef = ['palid', 'palTyp', 'kontro', 'relGewi', 'lkw'];
  pal = Object.values(PALETTENTYP);
  palcheck = true;
  paleten = new Array(this.pal.length);
  lkwNumbers : number[] = [20];
  subs: Subscription[] = [];
 
  constructor(
    private service: KontrollerService,
    private toaster: ToastrService,
    private dialog: MatDialog,
  ) {
    this.lkwNumbers = Array(20).fill(Number).map((x,i) => i);
  }
  ngOnDestroy(): void {
    if (this.subs.length > 0) {
      for (let i = 0; i< this.subs.length; i++) { 
        if(this.subs[i] !== undefined)
          this.subs[i].unsubscribe();
      }
    }
  }

  public ngOnInit(): void {
    this.getPalettenByKommId();
  }
  private async getPalettenByKommId() {
    this.subs.push( await this.service.getPalattenByKommId(this.kommNr).subscribe((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if(this.paletten[res[i].lkwNummer] === undefined) {
            this.paletten[res[i].lkwNummer] = [];
          }
          this.paletten[res[i].lkwNummer].push(res[i]);
        }
        this.paletten = this.paletten.filter(e => e);
        this.dataRes = new MatTableDataSource(this.paletten[0]);
        this.getPaltenMengeOfTyp();
        return;
      }
      const err = new Error();
      Object.assign(err, res);
      return this.toaster.error(err.message);
    }));
  }

  getTotalGewicht() {
    let gewicht = 0;
    for (let i = 0; i < this.dataRes.filteredData.length; i++) {
      gewicht += this.dataRes.filteredData[i].paletteRealGewicht;
    }
    return gewicht;
  }
  getPaletenMenge() {
    return this.dataRes.filteredData.length;
  }
  getPaltenMengeOfTyp() {
    if (!this.palcheck) return;
    this.palcheck = false;

    for (let y = 0; y < this.pal.length; y++) {
      for (let i = 0; i < this.dataRes.filteredData.length; i++) {
        if (this.dataRes.filteredData[i].palettenTyp === this.pal[y]) {
          if (this.paleten[y] === undefined) {
            this.paleten[y] = [this.pal[y], 1];
          } else {
            this.paleten[y][0] = this.pal[y];
            this.paleten[y][1] += 1;
          }
        }
      }
    }
    this.paleten = this.paleten.filter((el) => {
      return el !== undefined;
    });
    return this.paleten;
  }
  getPaleteForControlle(index: number, lkwnr :number) {
    const config = new MatDialogConfig();
    config.data = this.paletten[lkwnr][index].id;
    config.minWidth = '95vw';
    config.minHeight = '95vh';
    this.dialog.open(PalControlComponent, config).beforeClosed().subscribe((data) => {
      if(data === undefined) return;
      
      if (data === 0) {
        this.dataRes.filteredData[index].kontrolliert = 1;
        this.paletten[lkwnr][index].kontrolliert = 1;
        this.dataRes = new MatTableDataSource(this.dataRes.filteredData);
      }else if (data !== 0) {
        this.paletten[lkwnr][index].kontrolliert = 0;
        this.dataRes.filteredData[index].kontrolliert = 0;
        this.dataRes = new MatTableDataSource(this.dataRes.filteredData);
      }
    });
  }
  async paleteGewichtAndern(index: number) {
    let conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '40vw';
    conf.height = '40vh';
    conf.data = this.dataRes.filteredData[index].paletteRealGewicht;
   this.subs.push( this.dialog.open(PalgewichtComponent, conf).afterClosed().subscribe((data) => { 
    if(data === this.dataRes.filteredData[index].paletteRealGewicht || data === undefined || data.length < 1) {
      this.toaster.info('Vorgagng wurde abgebrochen', '', {timeOut: 700});
      return;
    }
    if(!isFinite(data) || data < 0) {
      this.toaster.error('Gewicht ist falsch, abgebrochen', '', {timeOut: 1000});
      return;
    }
     this.subs.push(  this.service.setPaleteGewicht(this.dataRes.filteredData[index].autoid, data).subscribe((res) => {
      if(res !== 1) {
        this.toaster.error('Etwas ist schiefgegangen beim spiechern, neue gewicht wurde nicht gespeichert!', '', {timeOut: 1000});
        return;
      }
      this.dataRes.filteredData[index].paletteRealGewicht = data;
      this.toaster.success('gewicht wurde geändert!', '', {timeOut: 800});
    }));
   }));
  }
  async paleteTypAndern(index: number) {
    this.subs.push(
      await this.service.setPaleteTyp(this.dataRes.filteredData[index].autoid ,this.dataRes.filteredData[index].palettenTyp).subscribe((res) => {
       if(res !== 1) {
        this.toaster.error('Etwas ist schiefgegangen, Paleten typ wurde nicht geändert!', '', {timeOut: 800});
        return;
       } 
       this.toaster.success('Palete wurde geändert!', '', {timeOut: 700});
      })
    );
  }
  async changeLkwNumber(index: number,tabnr: number) { 
    this.subs.push(  await this.service.setLkwNr(this.dataRes.filteredData[index].autoid, this.dataRes.filteredData[index].lkwNummer).subscribe((res) => {
      if (res !== 1) {
        const err = new Error();
        this.toaster.error(err.message, 'Ups...', {timeOut: 900});
        return;
      }
      let tmpdone: boolean = false;
    for(let i = 0; i < this.paletten.length; i++ ) {
      if ((this.paletten[i][0] !== undefined && this.paletten[i][0].lkwNummer !== undefined && 
        this.paletten[i][this.paletten[i].length-1] !== undefined && this.paletten[i][this.paletten[i].length-1].lkwNummer !== undefined ) &&
        this.paletten[i][this.paletten[i].length-1].lkwNummer === this.dataRes.filteredData[index].lkwNummer ) {
        this.paletten[i].push(this.paletten[tabnr].splice(index,1)[0]);
        if(this.paletten[tabnr].length > 0){
          this.dataRes = new MatTableDataSource(this.paletten[tabnr]);
        } else {
          for(let y = 0; y < this.paletten.length; y++ ) {
            if(this.paletten[y].length > 0){ 
              this.dataRes = new MatTableDataSource(this.paletten[tabnr]);
              this.paletten.splice(tabnr,1);
              break;
            }
          }
        }
        
        tmpdone = true;
      }
    }
    if(!tmpdone) {
      this.paletten[this.paletten.length] = [];
      this.paletten[this.paletten.length-1].push(this.paletten[tabnr].splice(index,1)[0]);
      if(this.paletten[tabnr].length > 0){
        this.dataRes = new MatTableDataSource(this.paletten[tabnr]);
      } else {
        for(let y = 0; y < this.paletten.length; y++ ) {
          if(this.paletten[y].length > 0){ 
            this.dataRes = new MatTableDataSource(this.paletten[tabnr]);
            break;
          }
        }
      }
      
      tmpdone = true;
    }
      this.toaster.success('Lkw nr wurde geandert!', 'LKW', {timeOut: 600});
    }));
  }
  matTabChange(index: number) {
  
   this.dataRes = new MatTableDataSource(this.paletten[index]);
  }
}
