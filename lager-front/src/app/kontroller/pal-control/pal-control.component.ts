import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { KontrollerService } from '../kontroller.service';

@Component({
  selector: 'app-pal-control',
  templateUrl: './pal-control.component.html',
  styleUrls: ['./pal-control.component.scss'],
})
export class PalControlComponent implements OnInit {
  columnDef: string[] = ['menge', 'name', 'kontro', 'aid', 'liferant'];
  tabData: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private refD: MatDialogRef<PalControlComponent>,
    private service: KontrollerService,
    @Inject(MAT_DIALOG_DATA) private data: number,
  ) {
    this.tabData = new MatTableDataSource();
  }

  public ngOnInit(): void {
    this.getPalete();
  }
  async getPalete() {
    return await this.service
      .getPalForControleByNr(this.data)
      .subscribe((res) => {
        if (res !== null && res.length > 0) {
          this.tabData = new MatTableDataSource(res);
        }
      });
  }
  async controlled(i: number) {
    console.log(this.tabData.filteredData[i].autoid);
    console.log(this.tabData.filteredData[i].kontrolliert);
  }
}
