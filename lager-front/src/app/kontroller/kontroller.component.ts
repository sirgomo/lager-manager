import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { DispositorDto } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { KommissComponent } from './kommiss/kommiss.component';
import { KontrollerService } from './kontroller.service';

@Component({
  selector: 'app-kontroller',
  templateUrl: './kontroller.component.html',
  styleUrls: ['./kontroller.component.scss'],
})
export class KontrollerComponent implements OnInit {
  kommiss: KomissDTO[] = [];
  dataSource: MatTableDataSource<KomissDTO> = new MatTableDataSource();
  spedition: SpeditionDto[] = [];
  dispositors: DispositorDto[] = [];
  namen: string[] = [];
  helper: HelperService = new HelperService();
  tabeleCoumns = [
    'lieferD',
    'versorgung',
    'id',
    'komStatus',
    'dispo',
    'paletH',
    'sped',
    'verk',
  ];
  komStatus: typeof KOMMISIONSTATUS;

  constructor(
    private service: KontrollerService,
    private dataPServ: DatenpflegeService,
    private toaster: ToastrService,
    private dialog: MatDialog,
  ) {
    this.komStatus = KOMMISIONSTATUS;
  }

  ngOnInit(): void {
    this.getDispositors();
  }

  private async getKommiss() {
    await this.service.getKommissionierungen().subscribe((data) => {
      if (data !== null && data.length > 0) {
        this.kommiss.splice(0, this.kommiss.length);
        for (let i = 0; i < data.length; i++) {
          this.namen.push(data[i].verk);
          this.kommiss.push(data[i]);
        }
        this.dataSource = new MatTableDataSource(this.kommiss);
      } else {
        this.toaster.error(this.helper.getErrorNachricht(data), 'Error');
      }
    });
  }
  private async getDispositors() {
    await this.dataPServ.getAllDispositors().subscribe((data) => {
      if (data !== undefined && data !== null) {
        this.dispositors.splice(0, this.dispositors.length);
        this.dispositors = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
          this.dispositors.splice(data[i].id, 1, data[i]);
        }
        this.getSpeditors();
      }
    });
  }
  private async getSpeditors() {
    await this.dataPServ.getAllSpeditions().subscribe((data) => {
      if (data !== undefined && data !== null) {
        this.spedition.splice(0, this.spedition.length);
        this.spedition = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
          this.spedition.splice(data[i].id, 1, data[i]);
        }
        this.getKommiss();
      } else {
        this.toaster.error(this.helper.getErrorNachricht(data), 'Error');
      }
    });
  }
  public getVerkaufer(verk: string) {
    const tmpNameArr = verk.split('.');
    return (
      tmpNameArr[0].charAt(0).toUpperCase() +
      '.' +
      tmpNameArr[1].charAt(0).toUpperCase() +
      tmpNameArr[1].substring(1, tmpNameArr[1].length)
    );
  }
  async getKommis(index: number) {
    await this.service.getKommByNr(this.kommiss[index].id).subscribe((res) => {
      if (res.length === undefined) {
        const err = res as unknown as Error;
        this.toaster.error(err.message);
        return;
      }
      const conf: MatDialogConfig = new MatDialogConfig();
      conf.width = '100vw';
      conf.height = '100vh';
      conf.maxHeight = '100vh';
      conf.maxWidth = '100vw';
      conf.enterAnimationDuration = 400;
      conf.panelClass = 'full-screen-modal';
      conf.data = res;
      this.dialog.open(KommissComponent, conf);
    });
  }
  keyinenum(): Array<string> {
    const keys = Object.keys(this.komStatus);
    return keys.slice();
  }
  onStatusChange(index: number) {
    this.service
      .setKommissStatus(this.kommiss[index].id, {
        KOMMISIONSTATUS: this.kommiss[index].kommissStatus,
      })
      .subscribe((res) => {
        if (res === 1) {
          this.toaster.success('Status wurde geändert', 'Status Update', {
            timeOut: 600,
          });
          return;
        }
        const err: Error = new Error();
        Object.assign(err, res);
        this.toaster.error(err.message);
      });
  }
}
