import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArtikelInfoDto } from 'src/app/dto/artikelinfo.dto';

@Component({
  selector: 'app-find-ware',
  templateUrl: './find-ware.component.html',
  styleUrls: ['./find-ware.component.scss'],
})
export class FindWareComponent implements OnInit {
  artikelinfo: ArtikelInfoDto[] = [];
  dataRes: MatTableDataSource<ArtikelInfoDto> = new MatTableDataSource();
  columnDef = ['lagerp', 'artmenge', 'mhd'];

  constructor(
    private dialRef: MatDialogRef<FindWareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: [ArtikelInfoDto[], number, number],
  ) {}

  ngOnInit(): void {
    if (this.data !== undefined || this.data !== null) {
      this.artikelinfo = this.data[0];
      this.dataRes = new MatTableDataSource(this.artikelinfo);
    }
  }
  lagerPlatzNachfullen(index: number) {
    this.data[0][index].artikelMenge = 1;
    if (window.confirm('Willst du der Lagerpaltz nachfüllen ?')) {
      return this.dialRef.close([
        this.data[0][index],
        this.data[1],
        this.data[2],
      ]);
    }
    this.dialRef.close(null);
  }
  artikelKommissioniren(index: number) {
    if (window.confirm('Paletten zur Kommissionierung hinzufügen')) {
      return this.dialRef.close([
        this.data[0][index],
        this.data[1],
        this.data[2],
      ]);
    }
    this.dialRef.close(null);
  }
  istEsWenigerAufDemLagerPlatz(): boolean {
    if (this.data[2] > this.data[0][0].artikelMenge) return true;

    return false;
  }
}
