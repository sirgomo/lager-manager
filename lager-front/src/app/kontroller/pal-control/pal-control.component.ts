import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { KontrollerService } from '../kontroller.service';
import { PalgewichtComponent } from '../palgewicht/palgewicht.component';

@Component({
  selector: 'app-pal-control',
  templateUrl: './pal-control.component.html',
  styleUrls: ['./pal-control.component.scss'],
})
export class PalControlComponent implements OnInit {
  columnDef: string[] = ['menge', 'name', 'kontro', 'aid', 'liferant'];
  tabData: MatTableDataSource<any> = new MatTableDataSource();
  isPaleteContrliret: number | undefined;

  constructor(
    private refD: MatDialogRef<PalControlComponent>,
    private service: KontrollerService,
    @Inject(MAT_DIALOG_DATA) private data: number,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.tabData = new MatTableDataSource();
  
  }


  public ngOnInit(): void {
    this.getPalete();
  }
  async getPalete() {
    const tmp: Subscription =  await this.service
      .getPalForControleByNr(this.data)
      .subscribe((res) => {
        if (res !== null && res.length > 0) {
          this.tabData = new MatTableDataSource(res);
          tmp.unsubscribe();
        }
      });
  }
  async controlled(i: number) {
    const tmp: Subscription =   await this.service.setArtikelControled(this.tabData.filteredData[i].autoid).subscribe((data) => {
      if (data !== 1) {
        const err = new Error();
        Object.assign(err, data);
        this.toastr.error(err.message, '', {timeOut: 800});
        return;
      }
      this.isPaleteContrliret = this.tabData.filteredData.length;
      
      for (let i = 0; i < this.tabData.filteredData.length; i++) {
        if(this.tabData.filteredData[i].kontrolliert) this.isPaleteContrliret -= 1;
      }
      this.toastr.success('Gespichert!', 'Artikel Controliren', {timeOut: 800});
      tmp.unsubscribe();
    });
  }
  async changeArtikelMenge(i: number) {
    let conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '40vw';
    conf.height = '40vh';
    conf.data = [this.tabData.filteredData[i].artikelMenge, 'Neue Artikel Menge (0 = position löschen)'];

    const tmp: Subscription = this.dialog.open(PalgewichtComponent, conf).afterClosed().subscribe((data) => {
      if(data === undefined || data === null || !Number.isInteger(data)) {
        this.toastr.error('Du must richtige menge eingeben!', 'Menge Abändern', {timeOut: 800, positionClass: 'toast-top-center'});
        tmp.unsubscribe();
        return;
      }
      const tmp2: Subscription = this.service.setNewArtikelMenge(this.tabData.filteredData[i].autoid, data).subscribe((res) => {
        if(res !== 1) {
          this.toastr.error('Etwas ist schiefgegangen, menge wurde nicht geändert', 'Menge Abändern', {timeOut: 800, positionClass: 'toast-top-center'});
          tmp.unsubscribe();
          tmp2.unsubscribe();
        }
        tmp.unsubscribe();
        tmp2.unsubscribe();
       this.getPalete();
       this.toastr.success('Menge wurde geändert', 'Menge Abändern', {timeOut: 700, positionClass: 'toast-top-center'});
      });
    })
  }
}
