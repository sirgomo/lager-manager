import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CreateKommisionierungComponent } from '../create-kommisionierung/create-kommisionierung.component';
import { DataDilerService } from '../data-diler.service';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { DispositorDto } from '../dto/dispositor.dto';
import { KomissDTO, KOMMISIONSTATUS } from '../dto/komiss.dto';
import { PalettenMengeVorausToDruckDto } from '../dto/paletenMengeVorausKom.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { VerkaufService } from './verkauf.service';

@Component({
  selector: 'app-verkauf',
  templateUrl: './verkauf.component.html',
  styleUrls: ['./verkauf.component.scss'],
})
export class VerkaufComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;
  komiss: KomissDTO[] = [];
  dataRes: MatTableDataSource<KomissDTO> = new MatTableDataSource();
  columnDef = [
    'kommid',
    'verkauferid',
    'maxPH',
    'lieferD',
    'dispo',
    'spedi',
    'versorgid',
    'kommStatus',
    'entfernen',
    'ausdrucken',
  ];

  kommStatus: typeof KOMMISIONSTATUS;
  spedi: SpeditionDto[] = [];
  dispo: DispositorDto[] = [];
  showDownload = false;
  kommissToDruck: PalettenMengeVorausToDruckDto[] = [];

  constructor(
    private serv: VerkaufService,
    private dataDie: DataDilerService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private datenPfleServ: DatenpflegeService,
    private helper: HelperService,
  ) {
    this.kommStatus = KOMMISIONSTATUS;
  }

  ngOnInit(): void {
    this.helper.setSideNav(this.sidenav);
    this.getSpedition();
  }
  async getSpedition() {
    await this.datenPfleServ.getAllSpeditions().subscribe((data) => {
      if (data !== null) {
        this.spedi.splice(0, this.spedi.length);
        this.spedi = Array(data.length);
        for (let i = 0; i !== data.length; i++) {
          // this.spedi.push(data[i]);
          this.spedi.splice(data[i].id, 1, data[i]);
        }
        this.getDispositors();
      }
    });
  }
  async getDispositors() {
    return await this.datenPfleServ.getAllDispositors().subscribe((data) => {
      if (data !== null) {
        this.dispo.splice(0, this.dispo.length);
        this.dispo = Array(data.length);
        for (let i = 0; i !== data.length; i++) {
          //  this.dispo.push(data[i]);
          this.dispo.splice(data[i].id, 1, data[i]);
        }
        this.alleKommissionierungen();
      }
    });
  }

  keyinenum(): Array<string> {
    const keys = Object.keys(this.kommStatus);
    return keys.slice();
  }
  kommStatusChange(id: number) {
    //mach etwas wenn kommisionirung status geendert wurde, nur check ob arbeitet
    this.komiss.forEach((data: KomissDTO) => {
      if (data.id == id) {
        this.serv
          .changeStatus(data.id, {
            kommissStatus: data.kommissStatus.toString(),
          })
          .subscribe((data) => {
            console.log(data);
          });
      }
    });
  }

  async alleKommissionierungen() {
    this.komiss.splice(0, this.komiss.length);
    this.showDownload = false;
    await this.serv.getAll().subscribe((res) => {
      if (res !== undefined && res !== null && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          this.komiss.push(res[i]);
        }
        this.dataRes = new MatTableDataSource(this.komiss);
        return;
      }
      this.toaster.error(
        'Etwas is schieff gegangen, kein Kommissionierung gefunden',
      );
    });
  }

  createKommissionirung() {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100vw';
    conf.height = '100vh';
    conf.maxHeight = '100vh';
    conf.maxWidth = '100vw';
    conf.panelClass = 'full-screen-modal';
    this.dialog
      .open<CreateKommisionierungComponent>(
        CreateKommisionierungComponent,
        conf,
      )
      .afterClosed()
      .subscribe((data) => {
        const tmpKom: KomissDTO = new KomissDTO();
        Object.assign(tmpKom, data);
        if (tmpKom !== null && isFinite(tmpKom.id)) {
          this.komiss.push(tmpKom);
          this.dataRes = new MatTableDataSource(this.komiss);
        }
      });
  }
  async updateKommissionierung(index: number) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100vw';
    conf.height = '100vh';
    conf.maxHeight = '100vh';
    conf.maxWidth = '100vw';
    conf.enterAnimationDuration = 400;
    conf.panelClass = 'full-screen-modal';
    await this.serv.getKommissById(this.komiss[index].id).subscribe((data) => {
      if (data === null) {
        this.toaster.error('Etwas ist schieffgelaufen, nicht gefunden');
        return;
      }
      conf.data = data;
      this.dialog
        .open<CreateKommisionierungComponent>(
          CreateKommisionierungComponent,
          conf,
        )
        .afterClosed()
        .subscribe((data) => {
          const tmpKom: KomissDTO = new KomissDTO();
          Object.assign(tmpKom, data);
          for (let i = 0; i < this.komiss.length; i++) {
            if (this.komiss[i].id === tmpKom.id) {
              this.komiss.splice(i, 1, tmpKom);
              this.dataRes = new MatTableDataSource(this.komiss);
            }
          }
        });
    });
  }
  async meinKommissionierungen() {
    this.showDownload = false;
    this.komiss.splice(0, this.komiss.length);
    await this.serv
      .getAllByVerkufer(Number(localStorage.getItem('myId')))
      .subscribe((res) => {
        if (res !== undefined && res !== null && res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            this.komiss.push(res[i]);
          }
          this.dataRes = new MatTableDataSource(this.komiss);
          return;
        }
        this.toaster.error(
          'Etwas is schieff gegangen, kein Kommissionierung gefunden',
        );
      });
  }
  async deleteKomm(index: number) {
    if (
      window.confirm(
        'Bist du sicher, dass du die kommissionirung löschen wilsst?',
      )
    ) {
      await this.serv
        .deleteKommissionierung(this.komiss[index].id)
        .subscribe((data) => {
          if (data === 1) {
            this.komiss.splice(index, 1);
          } else {
            this.toaster.error(
              'Etwas ist schieff gegangen, kommmissionierung ' +
                this.komiss[index].id +
                ' wurde nicht gelöscht',
              'Kommisionierung Löschen',
            );
          }
        });
    }
  }
  async getKommToDruck(kommid: number) {
    this.kommissToDruck.splice(0, this.kommissToDruck.length);
    await this.serv
      .getTotalGewichtAndPaleten(this.komiss[kommid].id)
      .subscribe((data) => {
        if (data !== null && data.length > 0) {
          for (let i = 0; i !== data.length; i++) {
            this.kommissToDruck.push(data[i]);
          }
          this.dataDie.setKomm(this.komiss[kommid]);
          this.showDownload = true;
        } else {
          this.toaster.error(
            'Kommissionierung ist leer, es mussen zuerst Artikels zugefügt werden!',
            'Error',
            { timeOut: 1000 },
          );
        }
      });
  }
}
