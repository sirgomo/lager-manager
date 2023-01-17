import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ArtikelComponent } from '../artikel/artikel.component';
import { DispositorDto } from '../dto/dispositor.dto';
import { HelperService } from '../helper.service';
import { WarenebuchungComponent } from '../warenebuchung/warenebuchung.component';
import { DatenpflegeService } from './datenpflege.service';
import { DebitorsComponent } from './debitors/debitors.component';
import { SpeditorsComponent } from './speditors/speditors.component';

@Component({
  selector: 'app-datenpflege',
  templateUrl: './datenpflege.component.html',
  styleUrls: ['./datenpflege.component.scss'],
})
export class DatenpflegeComponent implements OnInit {
  @ViewChild('artikel') public artikel!: ArtikelComponent;
  @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;
  @ViewChild('waren') public waren!: WarenebuchungComponent;
  dispositors: DispositorDto[] = [];
  show = 0;
  @ViewChild(DebitorsComponent) dispo!: DebitorsComponent;
  @ViewChild(SpeditorsComponent) spedi!: SpeditorsComponent;

  constructor(
    private servi: DatenpflegeService,
    private fb: FormBuilder,
    private helper: HelperService,
  ) {}

  ngOnInit(): void {
    this.show = 0;
    this.helper.setSideNav(this.sidenav);
  }
  getAllDispositors() {
    this.show = 1;
  }
  getAllspeditiors() {
    this.show = 3;
  }
  newSpedi() {
    this.spedi.createNewSpeditor();
  }
  newDispo() {
    this.dispo.addDispositor();
  }
  showAretikel() {
    this.show = 4;
    if (this.show === 4 && this.artikel !== undefined) {
      this.artikel.show = 1;
    }
  }
  showWarenBuchung() {
    this.show = 5;
    if (this.show === 5 && this.waren !== undefined) {
      this.waren.show = 1;
    }
  }
}
