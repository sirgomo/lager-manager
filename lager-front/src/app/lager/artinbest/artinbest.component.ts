import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { VerkaufService } from 'src/app/verkauf/verkauf.service';

@Component({
  selector: 'app-artinbest',
  templateUrl: './artinbest.component.html',
  styleUrls: ['./artinbest.component.scss'],
})
export class ArtinbestComponent implements OnInit {
  @Input() artIdandLifId: number[] = [];
  columnDef: string[] = [
    'id',
    'kommid',
    'menge',
    'gepackt',
    'liferDate',
    'artName',
  ];
  tabData: MatTableDataSource<any> = new MatTableDataSource();
  constructor(
    private verkService: VerkaufService,
    private toastr: ToastrService,
  ) {}
  public ngOnInit(): void {
    this.getBestelungWithArtikel();
  }
  async getBestelungWithArtikel() {
    await this.verkService
      .getArtikelInKommiss(this.artIdandLifId[0], this.artIdandLifId[1])
      .subscribe((res) => {
        if (res === undefined || res === null || res.length < 1) {
          this.toastr.info(
            'Keine Kommissionierung with Artikel gefunden',
            'Artikel in Kommissionierungen',
            { timeOut: 700 },
          );
        }
        this.tabData = new MatTableDataSource(res);
      });
  }
}
