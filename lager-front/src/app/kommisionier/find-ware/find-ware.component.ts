import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArtikelInfo } from 'src/app/dto/artikelinfo.dto';

@Component({
  selector: 'app-find-ware',
  templateUrl: './find-ware.component.html',
  styleUrls: ['./find-ware.component.scss'],
})
export class FindWareComponent implements OnInit {
  artikelinfo: ArtikelInfo[] = [];
  constructor(
    private dialRef: MatDialogRef<FindWareComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArtikelInfo[],
  ) {}

  ngOnInit(): void {
    if (this.data !== undefined || this.data !== null) {
      this.artikelinfo = this.data;
    }
  }
}
