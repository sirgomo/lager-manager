import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { PALETTENTYP } from 'src/app/dto/lagerPlatz.dto';
import { PaleteForControlleDto } from 'src/app/dto/paleteForControlle.dto';
import { KontrollerService } from '../kontroller.service';
import { PalControlComponent } from '../pal-control/pal-control.component';

@Component({
  selector: 'app-paletten',
  templateUrl: './paletten.component.html',
  styleUrls: ['./paletten.component.scss'],
})
export class PalettenComponent implements OnInit {
  @Input() kommNr = 0;
  paletten: PaleteForControlleDto[] = [];
  dataRes: MatTableDataSource<PaleteForControlleDto> = new MatTableDataSource();
  columnDef = ['palid', 'palTyp', 'kontro', 'relGewi'];
  pal = Object.values(PALETTENTYP);
  palcheck = true;
  paleten = new Array(this.pal.length);
  constructor(
    private service: KontrollerService,
    private toaster: ToastrService,
    private dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.service.getPalattenByKommId(this.kommNr).subscribe((res) => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          this.paletten.push(res[i]);
        }
        this.dataRes = new MatTableDataSource(this.paletten);
        this.getPaltenMengeOfTyp();
        return;
      }
      const err = new Error();
      Object.assign(err, res);
      return this.toaster.error(err.message);
    });
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
  getPaleteForControlle(index: number) {
    const config = new MatDialogConfig();
    config.data = this.paletten[index].id;
    config.minWidth = '95vw';
    config.minHeight = '95vh';
    this.dialog.open(PalControlComponent, config);
  }
}
