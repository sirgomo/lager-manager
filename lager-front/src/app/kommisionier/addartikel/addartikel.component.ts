import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataFurKomisDto } from 'src/app/dto/dataFurKomis.dto';

@Component({
  selector: 'app-addartikel',
  templateUrl: './addartikel.component.html',
  styleUrls: ['./addartikel.component.scss'],
})
export class AddartikelComponent implements OnInit {
  artikel: DataFurKomisDto = new DataFurKomisDto();
  constructor(
    private ref: MatDialogRef<AddartikelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataFurKomisDto,
    private toastr: ToastrService,
  ) {}
  ngOnInit(): void {
    if (this.data === undefined || this.data === null) {
      this.toastr.error('Etwas is schieff gelaufen, kein Artikel gefunden!');
    }
    this.artikel = this.data;
  }
  aufPaletehinzufugen(menge: string) {
    const tmpMenge = Number(menge);
    if (tmpMenge > this.artikel.menge) {
      this.toastr.error('Du kannst nicht mehr als verfügbar ist erfassen!');
      return;
    }
    this.data.menge = tmpMenge;
    this.ref.close(this.data);
  }
}
