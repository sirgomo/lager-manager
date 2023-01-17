import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SpeditionDto } from 'src/app/dto/spedition.dto';
import { DatenpflegeService } from '../datenpflege.service';
import { AddSpedition } from './addSpedition';

@Component({
  selector: 'app-speditors',
  templateUrl: './speditors.component.html',
  styleUrls: ['./speditors.component.scss'],
})
export class SpeditorsComponent implements OnInit {
  spedi: SpeditionDto[] = [];
  tabRes: MatTableDataSource<SpeditionDto> = new MatTableDataSource();
  columnDef: string[] = ['spedid', 'spedname', 'gewicht', 'palmen', 'delete'];
  constructor(
    private servi: DatenpflegeService,
    private dial: MatDialog,
    private toastr: ToastrService,
  ) {}
  public ngOnInit(): void {
    this.getSpeditors();
  }
  async getSpeditors() {
    await this.servi.getAllSpeditions().subscribe((res) => {
      if (res !== undefined && res !== null && res.length > 0) {
        this.spedi = new Array(res.length);
        for (let i = 0; i < this.spedi.length; i++) {
          this.spedi.splice(i, 1, res[i]);
        }
        this.tabRes = new MatTableDataSource(this.spedi);
      }
    });
  }
  createNewSpeditor() {
    const conf: MatDialogConfig<SpeditionDto> = new MatDialogConfig();
    this.dial
      .open(AddSpedition, conf)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data !== null) {
          this.servi.createNewSpeditor(data).subscribe((res) => {
            if (res !== null && res.id !== undefined) {
              this.spedi.push(res);
              this.tabRes = new MatTableDataSource(this.spedi);
              this.toastr.success('Die Spedition wurde erstellt');
            } else {
              this.toastr.error(
                'Etwas ist schiefgelaufen, kein antwort vom api',
              );
            }
          });
        } else {
          this.toastr.error('Ok, es wurde Abgebrochen');
        }
      });
  }
  updateSpeditor(s: SpeditionDto) {
    this.servi.updateSpeditor(s, s.id);
  }
  deleteSpeditor(index: number) {
    this.servi.deleteSpeditor(this.spedi[index].id);
    this.spedi.splice(index, 1);
    this.tabRes = new MatTableDataSource(this.spedi);
  }
  editSpedi(id: number) {
    const conf: MatDialogConfig<SpeditionDto> = new MatDialogConfig();
    conf.data = this.spedi[id];
    this.dial
      .open(AddSpedition, conf)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data !== null) {
          this.servi.updateSpeditor(data, data.id).subscribe((res) => {
            if (res !== null && res.id !== undefined) {
              this.spedi[id] = res;
              this.tabRes = new MatTableDataSource(this.spedi);
              this.toastr.success('Die Spedition wurde upgedated');
            } else {
              this.toastr.error(
                'Etwas ist schiefgelaufen, kein antwort vom api',
              );
            }
          });
        } else {
          this.toastr.error('Ok, es wurde Abgebrochen');
        }
      });
  }
}
