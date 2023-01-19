import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LagerPlatztDto, PALETTENTYP } from '../dto/lagerPlatz.dto';
import { HelperService } from '../helper.service';
import { LagerService } from './lager.service';
import { DatePipe } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lager',
  templateUrl: './lager.component.html',
  styleUrls: ['./lager.component.scss'],
  providers: [DatePipe],
})
export class LagerComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  show = 1;
  lagerPlatze: LagerPlatztDto[] = [];
  pltzGrosse = '';
  searchModel = '';
  index = -1;
  downloadKomplet = false;
  lifer: string[] = [];
  public readonly palettenTyp: typeof PALETTENTYP = PALETTENTYP;
  tabRes: MatTableDataSource<LagerPlatztDto> = new MatTableDataSource();
  columnDef: string[] = [
    'lplatz',
    'artid',
    'aname',
    'lifer',
    'amenge',
    'einheit',
    'palt',
    'mhd',
    'sttic',
  ];
  lagerPlatztForm: FormGroup;
  constructor(
    private lagerServ: LagerService,
    private fb: FormBuilder,
    private helper: HelperService,
    private toastr: ToastrService,
  ) {
    this.lagerPlatztForm = this.fb.group({
      id: Number,
      lagerplatz: [''],
      artId: [Number],
      name: [''],
      artikelMenge: [Number],
      einheit: [Number],
      palettenTyp: PALETTENTYP,
      mhd: Date,
      lagerPlatzVolumen: [Number],
      static: Boolean,
      liferant: [Number],
      mengeProPalete: [Number],
      barcode: [''],
    });
  }

  ngOnInit(): void {
    this.getStellpletze();
    this.helper.setSideNav(this.sidenav);
  }
  async getStellpletze() {
    this.downloadKomplet = false;
    this.lagerPlatze.splice(0, this.lagerPlatze.length);
    await this.lagerServ.getAllStellpletze().subscribe((data) => {
      for (let i = 0; i !== data.length; i++) {
        this.lagerPlatze.push(data[i]);
        this.lifer.push(data[i].lifer);
      }
      const tmpTab: LagerPlatztDto[] = this.lagerPlatze.slice(0, 50);
      this.tabRes = new MatTableDataSource(tmpTab);
      this.show = 1;
      this.downloadKomplet = true;
    });
  }
  getLiferName() {
    // eslint-disable-next-line prettier/prettier
    return this.lifer[this.index];
  }
  artikelTrackBy(index: number) {
    try {
      return this.lagerPlatze[index];
    } catch (err) {
      return err;
    }
  }

  createUpdateLagerPlatz(index: number) {
    if (index === -1) this.lagerPlatztForm.reset();
    if (index !== -1) {
      this.lagerPlatztForm.patchValue(this.lagerPlatze[index]);
    }
    this.show = 2;
    this.index = index;
  }
  savePlatz(platz: LagerPlatztDto) {
    if (platz.id === undefined || platz.id === null) {
      let großearra: string[] = [];
      const rawVal: string = this.lagerPlatztForm
        .get('lagerPlatzVolumen')
        ?.getRawValue();
      if (rawVal.length > 3) {
        großearra = rawVal.split('x');
      }
      platz.lagerPlatzVolumen =
        Number(großearra[0]) * Number(großearra[1]) * Number(großearra[2]);
      console.log(platz.palettenTyp);
    } else {
      platz.artId = this.lagerPlatze[this.index].artId;
      platz.artikelMenge = this.lagerPlatze[this.index].artikelMenge;
      platz.einheit = this.lagerPlatze[this.index].einheit;
      platz.name = this.lagerPlatze[this.index].name;
    }

    return this.lagerServ.createPlatz(platz).subscribe((data) => {
      if (data) {
        this.lagerPlatze[this.index] = data;
        this.showFront();
      } else {
        console.log(data);
      }
    });
  }
  showFront() {
    this.lagerPlatztForm.reset();
    const tmpTab: LagerPlatztDto[] = this.lagerPlatze.slice(0, 50);
    this.tabRes = new MatTableDataSource(tmpTab);
    this.show = 1;
    this.index = -1;
  }
  async onSearch(was: string) {
    if (this.downloadKomplet) {
      this.lagerPlatze = await this.helper.onSearchPlatz(was, this.lagerPlatze);
      const tmpTab: LagerPlatztDto[] = this.lagerPlatze.slice(0, 50);
      this.tabRes = new MatTableDataSource(tmpTab);
    }
  }
  deletePlatz(platz: LagerPlatztDto) {
    if (this.lagerPlatze[this.index].artId !== null) {
      this.toastr.error(
        'Der Platz kann nicht entfernt werden denn er nicht lehr ist',
        'Error',
      );
      return;
    }
    this.lagerServ.deletePlatz(platz.id).subscribe((data) => {
      if (data) {
        this.lagerPlatze.splice(this.index, 1);
        this.showFront();
      }
    });
  }
}
