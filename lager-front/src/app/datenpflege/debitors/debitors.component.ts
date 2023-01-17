import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DispositorDto } from 'src/app/dto/dispositor.dto';
import { DatenpflegeService } from '../datenpflege.service';
import { AddDebitorComponent } from './add-debitor.component';

@Component({
  selector: 'app-debitors',
  templateUrl: './debitors.component.html',
  styleUrls: ['./debitors.component.scss'],
})
export class DebitorsComponent implements OnInit {
  dispositors: DispositorDto[] = [];
  dataTab!: MatTableDataSource<DispositorDto>;
  columnDef: string[] = ['dispoid', 'name', 'name2', 'stadt', 'loschen'];
  constructor(
    private serv: DatenpflegeService,
    private toastr: ToastrService,
    private matDialg: MatDialog,
  ) {}
  ngOnInit(): void {
    this.getDispositors();
  }
  async getDispositors() {
    this.serv.getAllDispositors().subscribe((res) => {
      if (res !== undefined && res !== null && res.length > 0) {
        this.dispositors = new Array(res.length);
        for (let i = 0; i < res.length; i++) {
          this.dispositors.splice(i, 1, res[i]);
        }
        this.dataTab = new MatTableDataSource(this.dispositors);
      }
    });
  }
  addDispositor() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '70%';

    this.matDialg
      .open(AddDebitorComponent, conf)
      .afterClosed()
      .subscribe((data) => {
        if (data !== undefined && data.name.length > 2) {
          this.serv.createNewDispositor(data).subscribe((dispo) => {
            if (dispo !== null && dispo !== undefined && dispo.id !== null) {
              this.dispositors.push(dispo);
              this.dataTab = new MatTableDataSource(this.dispositors);
            }
          });
        } else {
          this.toastr.error('Abgebrochen');
        }
      });
  }
  editDispo(i: number) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '70%';
    conf.data = this.dispositors[i];
    this.matDialg
      .open(AddDebitorComponent, conf)
      .afterClosed()
      .subscribe((data) => {
        if (
          data !== undefined &&
          data.id !== null &&
          this.dispositors[i].id === data.id
        ) {
          if (this.dispositors[i] !== data) {
            this.serv.createNewDispositor(data).subscribe((dispo) => {
              if (dispo !== null && dispo !== undefined && dispo.id !== null)
                this.dispositors[i] = dispo;
              this.dataTab = new MatTableDataSource(this.dispositors);
            });
          }
        } else {
          this.toastr.error('Abgebrochen');
        }
      });
  }
  deleteDispositor(index: number) {
    this.serv.deleteDispositor(this.dispositors[index].id).subscribe((res) => {
      if (res === 1) {
        this.dispositors.splice(index, 1);
        this.dataTab = new MatTableDataSource(this.dispositors);
        return;
      }
      this.toastr.error('Etwas ist schiefgegangen');
    });
  }
}
