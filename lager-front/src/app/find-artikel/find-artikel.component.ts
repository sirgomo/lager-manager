import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FindArtikelInKommissDto } from '../dto/findArtikelinKom.dto';
import { VerkaufService } from '../verkauf/verkauf.service';

@Component({
  selector: 'app-find-artikel',
  templateUrl: './find-artikel.component.html',
  styleUrls: ['./find-artikel.component.scss'],
})
export class FindArtikelComponent implements OnInit {
  show = 1;
  menge = 0;
  maxmenge = 0;
  currentkommid: number | undefined;
  curenntItem: FindArtikelInKommissDto = new FindArtikelInKommissDto();
  artikelid: number | undefined;
  liferantid: number | undefined;
  columnDef: string[] = ['id', 'name', 'kommid', 'menge', 'gepackt', 'gdate'];
  tabData: MatTableDataSource<FindArtikelInKommissDto> =
    new MatTableDataSource();
  constructor(
    private verkService: VerkaufService,
    private dialogRef: MatDialogRef<FindArtikelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number[],
    private snackbar: MatSnackBar,
  ) {}
  public ngOnInit(): void {
    this.currentkommid = this.data[0];
    this.artikelid = this.data[1];
    this.liferantid = this.data[2];
    this.getData();
  }
  async getData() {
    if (this.artikelid !== undefined && this.liferantid !== undefined) {
      const snackConf: MatSnackBarConfig = new MatSnackBarConfig();
      snackConf.duration = 800;
      return await this.verkService
        .getArtikelInKommiss(this.artikelid, this.liferantid)
        .subscribe((res) => {
          if (res === undefined || res === null || res.length < 1) {
            const snackConf: MatSnackBarConfig = new MatSnackBarConfig();
            snackConf.duration = 800;
            this.snackbar.open(
              'Kein Artikels in Kommissionierungen',
              '',
              snackConf,
            );
          }
          this.tabData = new MatTableDataSource(res);
        });
    }
    const snackConf: MatSnackBarConfig = new MatSnackBarConfig();
    snackConf.duration = 800;
    this.snackbar.open(
      'Etwas ist schiefgegangen, artikelid oder liferant id ist undefined',
      '',
      snackConf,
    );
    return;
  }
  getBorder(i: number) {
    if (
      this.tabData.filteredData[i].gepackt === 'GEPACKT' ||
      this.tabData.filteredData[i].gepackt === 'TEILGEPACKT'
    ) {
      return (
        'border-top-color: red;' +
        'border-bottom-color: red;' +
        'background-color: rgb(155, 67, 67);'
      );
    }

    return 'cursor: pointer;';
  }
  artSchieben() {
    if (this.menge > this.maxmenge) {
      this.snackbar.open(
        'Du kannst nur das schiben was im kommissionierung verfügber ist',
        '',
        { duration: 1500 },
      );
      return;
    }
    this.curenntItem.menge = this.menge;
    this.dialogRef.close(this.curenntItem);
  }
  abbrechen() {
    this.show = 1;
    this.curenntItem = new FindArtikelInKommissDto();
  }
  schibenActive(index: number) {
    this.maxmenge = 0;
    if (
      this.tabData.filteredData[index].gepackt === 'GEPACKT' ||
      this.tabData.filteredData[index].gepackt === 'TEILGEPACKT'
    )
      return;
    this.maxmenge = this.tabData.filteredData[index].menge;
    Object.assign(this.curenntItem, this.tabData.filteredData[index]);
    this.show = 2;
  }
}
