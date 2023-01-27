import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { WareningangService } from '../wareningang.service';

@Component({
  selector: 'app-stellplatze',
  templateUrl: './stellplatze.component.html',
  styleUrls: ['./stellplatze.component.scss'],
})
export class StellplatzeComponent implements OnInit {
  lagerPlatzData: LagerplatzeData[] = [];
  freiePlatze: MatTableDataSource<any> = new MatTableDataSource();
  columnDef: string[] = ['platz', 'static'];
  staticColumnDef: string[] = ['platz', 'menge', 'mhd'];
  barCode = '';
  @Input() artikelData: number[] = [];
  @Output() platzData = new EventEmitter<LagerPlatzMitId>();
  staticArtikelPlatz: MatTableDataSource<StaticPlatzMitArtikel> =
    new MatTableDataSource();
  constructor(
    private warenService: WareningangService,
    private toaster: ToastrService,
  ) {}
  public ngOnInit(): void {
    this.getCount();
  }
  async getCount() {
    this.lagerPlatzData.splice(0, this.lagerPlatzData.length);
    await this.warenService.getCountOfPlatze().subscribe((res) => {
      if (res === undefined || res === null) {
        this.toaster.error(
          'Etwas ist schief, keine Lagerplatze gefunden',
          'LagerPlatz',
          { timeOut: 1000 },
        );
      }

      for (let i = 0; i < res.length; i++) {
        const tmp: LagerplatzeData = res[i];
        Object.assign(tmp, res[i]);
        this.lagerPlatzData.push(tmp);
      }
      //  console.log(this.lagerPlatzData);
    });
  }

  async showGang(nr: number) {
    await this.warenService.getPlatzeImGang(nr).subscribe((res) => {
      if (res === undefined || res === null || res.length < 1) {
        this.toaster.error(
          'Etwas ist schief, keine LAgerplatze gefunden',
          'LagerPlatz',
          { timeOut: 1000 },
        );
        return;
      }
      this.freiePlatze = new MatTableDataSource(res);
    });
  }
  usePlatz(index: number) {
    const data: LagerPlatzMitId = this.freiePlatze.filteredData[index];
    this.platzData.emit(data);
  }
  useStaticPlatz(index: number) {
    const data: LagerPlatzMitId = {
      id: 0,
      lagerplatz: '',
      prufziffern: 0,
      static: 1,
    };
    Object.assign(data, this.staticArtikelPlatz.filteredData[index]);
    this.platzData.emit(data);
  }
  async showStatik(index: number) {
    if (index === 1) {
      this.warenService
        .getStaticPlatzMitWaren(this.artikelData[0], this.artikelData[1])
        .subscribe((res) => {
          if (res === undefined || res === null || res.length < 1) {
            const err: Error = new Error();
            Object.assign(err, res);
            this.toaster.error(err.message, '', { timeOut: 800 });
          }
          this.staticArtikelPlatz = new MatTableDataSource(res);
        });
    }
  }
  async platzBarcodeScanen() {
    if (this.barCode.length < 3) {
      return;
    }
    await this.warenService.getPlatzByScan(this.barCode).subscribe((data) => {
      console.log(data);
      if (data.lagerplatz !== undefined && data.lagerplatz !== null) {
        this.platzData.emit(data);
      } else {
        const err = new Error();
        Object.assign(err, data);
        this.toaster.error(err.message, '', { timeOut: 800 });
      }
    });
  }
}

export interface LagerplatzeData {
  gang: number;
  bezetz: number;
  total: number;
  freestatic: number;
}
export interface LagerPlatzMitId {
  id: number;
  lagerplatz: string;
  static: number;
  prufziffern: number;
}
export interface StaticPlatzMitArtikel {
  id: number;
  lagerplatz: string;
  artikelMenge: number;
  prufziffern: number;
  mhd: Date;
}
