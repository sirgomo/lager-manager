import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ArtikelKommissDto } from 'src/app/dto/artikelKommiss.dto';
import { ControllerKomissDataDto } from 'src/app/dto/controllerKomissData.dto';
import { HelperService } from 'src/app/helper.service';
import { KontrollerService } from '../kontroller.service';

@Component({
  selector: 'app-kommiss',
  templateUrl: './kommiss.component.html',
  styleUrls: ['./kommiss.component.scss'],
})
export class KommissComponent implements OnInit {
  currentKomiss: ControllerKomissDataDto[] = [];
  dataSource: MatTableDataSource<ControllerKomissDataDto> =
    new MatTableDataSource();
  stellPlat = 0;
  gewicht = 0;
  user = '';
  columnName = [
    'artId',
    'artName',
    'artMenge',
    'currge',
    'artGepackt',
    'kommissionier',
  ];
  constructor(
    private dialRef: MatDialogRef<KommissComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    private data: ControllerKomissDataDto[],
    private toaster: ToastrService,
    private helper: HelperService,
    private servis: KontrollerService,
  ) {}
  public ngOnInit(): void {
    if (this.data === null) {
      this.toaster.error('Kommissionierung fehlt!', 'Error');
      return;
    }
    let stellplattze = 0;
    let totalGewicht = 0;
    ({ stellplattze, totalGewicht } = this.helper.getPaletsDeatails(
      this.data as unknown as ArtikelKommissDto[],
    ));
    this.stellPlat = stellplattze;
    this.gewicht = totalGewicht;
    this.checkName();
    this.dataSource = new MatTableDataSource(this.data);
  }

  async checkName() {
    let gefunden = false;
    for (let i = 0; i < this.data.length; i++) {
      if (!gefunden) {
        if (this.data[i].palettennr !== null) {
          await this.servis
            .getKommissionierbyPalId(this.data[i].palettennr)
            .subscribe((res) => {
              if (res[0] !== undefined) {
                this.user =
                  res[0].vorname[0].toUpperCase() +
                  '.' +
                  res[0].nachname[0].toUpperCase() +
                  res[0].nachname.slice(1, res[0].nachname.length);
                this.currentKomiss = this.data;
              }
            });
          gefunden = true;
        }
      }
      if (!gefunden && i === this.data.length - 1) {
        this.currentKomiss = this.data;
      }
    }
  }
}
