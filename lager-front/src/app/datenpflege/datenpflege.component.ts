import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DispositorDto } from '../dto/dispositor.dto';
import { SpeditionDto } from '../dto/spedition.dto';
import { DatenpflegeService } from './datenpflege.service';
import { DebitorsComponent } from './debitors/debitors.component';
import { SpeditorsComponent } from './speditors/speditors.component';

@Component({
  selector: 'app-datenpflege',
  templateUrl: './datenpflege.component.html',
  styleUrls: ['./datenpflege.component.scss'],
})
export class DatenpflegeComponent implements OnInit {
  dispositors: DispositorDto[] = [];
  speditors: SpeditionDto[] = [];
  show = 0;
  @ViewChild(DebitorsComponent) dispo!: DebitorsComponent;
  @ViewChild(SpeditorsComponent) spedi!: SpeditorsComponent;

  constructor(private servi: DatenpflegeService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.show = 0;
  }
  getAllDispositors() {
    this.show = 1;
    this.dispositors.splice(0, this.dispositors.length);
    return this.servi.getAllDispositors().subscribe((data) => {
      if (data !== undefined && data !== null && data.length > 0) {
        data.forEach((dispo) => {
          this.dispositors.push(dispo);
        });
      }
    });
  }

  getAllspeditiors() {
    this.show = 3;
    this.speditors.splice(0, this.speditors.length);
    return this.servi.getAllSpeditions().subscribe((data) => {
      data.forEach((d) => {
        this.speditors.push(d);
      });
    });
  }

  newSpedi() {
    this.spedi.createNewSpeditor();
  }
  newDispo() {
    this.dispo.addDispositor();
  }
}
