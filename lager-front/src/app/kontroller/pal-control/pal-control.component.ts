import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { KontrollerService } from '../kontroller.service';

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
  ) {
    this.tabData = new MatTableDataSource();
  
  }

  public ngOnInit(): void {
    this.getPalete();
  }
  async getPalete() {
       await this.service
      .getPalForControleByNr(this.data)
      .subscribe((res) => {
        if (res !== null && res.length > 0) {
          this.tabData = new MatTableDataSource(res);
        }
      });
  }
  async controlled(i: number) {
    await this.service.setArtikelControled(this.tabData.filteredData[i].autoid).subscribe((data) => {
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
    });
  }
}
