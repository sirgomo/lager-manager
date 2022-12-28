import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { DispositorDto } from '../dto/dispositor.dto';
import { KomissDTO } from '../dto/komiss.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { HelperService } from '../helper.service';
import { KontrollerService } from './kontroller.service';

@Component({
  selector: 'app-kontroller',
  templateUrl: './kontroller.component.html',
  styleUrls: ['./kontroller.component.scss'],
})
export class KontrollerComponent implements OnInit {
  kommiss: KomissDTO[] = [];
  spedition: SpeditionDto[] = [];
  dispositors: DispositorDto[] = [];
  namen: string[] = [];
  helper: HelperService = new HelperService();
  constructor(
    private service: KontrollerService,
    private dataPServ: DatenpflegeService,
    private toaster: ToastrService,
  ) {}

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
}
