import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { DatenpflegeService } from '../datenpflege/datenpflege.service';
import { ArtikelMengeDto } from '../dto/artikelMenge.dto';
import { DispositorDto } from '../dto/dispositor.dto';
import { LagerPlatztDto, PALETTENTYP } from '../dto/lagerPlatz.dto';
import { WarenBuchungDto } from '../dto/warenBuchung.dto';
import { WarenEinArtikleDto } from '../dto/warenEinArtikle.dto';
import { HelperService } from '../helper.service';
import { LagerPlatzMitId } from './stellplatze/stellplatze.component';
import { WareningangService } from './wareningang.service';

@Component({
  selector: 'app-wareneingang',
  templateUrl: './wareneingang.component.html',
  styleUrls: ['./wareneingang.component.scss'],
})
export class WareneingangComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  tabBuchungen: MatTableDataSource<WarenBuchungDto> = new MatTableDataSource();
  columnDef: string[] = ['liferant', 'tor', 'liferung'];
  tabArtikel: MatTableDataSource<WarenEinArtikleDto> = new MatTableDataSource();
  columnArtDef: string[] = ['aid', 'aname', 'menge', 'lifid'];
  buchungen: WarenBuchungDto[] = [];
  dispostors: DispositorDto[] = [];
  artikles: WarenEinArtikleDto[] = [];
  show = -1;
  currentLiferung = -1;
  currentArtikelMenge = 0;
  palete = false;
  mhd: Date | undefined;
  lagerPlatz: undefined | LagerPlatztDto;
  artikelIndex = -1;
  manualLagerPlatz = '';
  role: string | null;
  palettenTypEnum: typeof PALETTENTYP = PALETTENTYP;
  paletteTyp: PALETTENTYP;
  prufziffern: number | undefined;
  artData: number[] = [];

  constructor(
    private dispoService: DatenpflegeService,
    private warenServi: WareningangService,
    private toaster: ToastrService,
    private helper: HelperService,
  ) {
    this.role = localStorage.getItem('role');
    this.paletteTyp = PALETTENTYP.KEINPALETTE;
  }

  ngOnInit(): void {
    this.getBuchungen();
    this.helper.setSideNav(this.sidenav);
  }
  async getBuchungen() {
    await this.getDispositors();
    this.buchungen.splice(0, this.buchungen.length);
    await this.warenServi.getAllLiferungen().subscribe((data) => {
      for (let i = 0; i !== data.length; i++) {
        if (data[i].eingebucht && data[i].artikelsGebucht) {
          this.buchungen.push(data[i]);
        }
        this.tabBuchungen = new MatTableDataSource(this.buchungen);
      }
      this.currentLiferung = -1;
      this.show = 1;
    });
  }
  async getDispositors() {
    await this.dispoService.getAllDispositors().subscribe((data) => {
      if (data !== undefined && data !== null) {
        this.dispostors.splice(0, this.dispostors.length);
        data.forEach((dispo) => {
          this.dispostors.push(dispo);
        });
      }
    });
  }
  async getAritkles(nr: number) {
    return await this.warenServi.getArtikles(nr).subscribe((data) => {
      this.artikles.splice(0, this.artikles.length);
      if (data != undefined) {
        data.forEach((art) => {
          this.artikles.push(art);
        });
      }
      this.tabArtikel = new MatTableDataSource(this.artikles);
      this.show = 2;
      this.currentLiferung = nr;
      this.artikelIndex = -1;
      this.mhd = undefined;
      this.paletteTyp = PALETTENTYP.KEINPALETTE;
    });
  }
  showArtikel(index: number) {
    this.artData.splice(0, this.artData.length);
    this.currentArtikelMenge = 0;
    this.palete = false;
    this.show = 3;
    this.lagerPlatz = undefined;
    this.artikelIndex = index;
    this.manualLagerPlatz = '';
    this.artData.push(this.artikles[index].artikelid);
    this.artData.push(this.artikles[index].kreditorId);
  }
  //return platz nach artikel volumen
  async getPlatz() {
    if (this.currentArtikelMenge === 0) {
      this.toaster.error('Du musst artikel menge eingeben! ', 'Menge Error', {
        timeOut: 800,
      });
      return;
    } else if (
      this.currentArtikelMenge > this.artikles[this.artikelIndex].menge
    ) {
      this.toaster.error(
        ' Artikel menge darft nicht größe sein als menge in auftrag',
      );
      return;
    }
    this.lagerPlatz = new LagerPlatztDto();
    const tmp: ArtikelMengeDto = new ArtikelMengeDto();
    tmp.palete = this.paletteTyp;
    tmp.menge = this.currentArtikelMenge;
    tmp.aid = this.artikles[this.artikelIndex].aid;
    tmp.artikelId = this.artikles[this.artikelIndex].artikelid;
    tmp.liferant = this.artikles[this.artikelIndex].kreditorId;
    if (this.mhd !== undefined) {
      tmp.mhd = this.mhd;
    }

    return await this.warenServi.getPlatz(tmp).subscribe((data) => {
      if (this.lagerPlatz !== undefined) {
        if (data.artikelMenge === null) {
          this.lagerPlatz.artikelMenge = 0;
        } else if (data.artikelMenge > 0) {
          this.lagerPlatz.artikelMenge = data.artikelMenge;
        }
      }

      if (this.lagerPlatz !== undefined) {
        this.lagerPlatz.artikelMenge += this.currentArtikelMenge;

        this.lagerPlatz.palettenTyp = this.paletteTyp;
        if (this.mhd !== undefined) {
          this.lagerPlatz.mhd = this.mhd;
        }
        this.lagerPlatz.liferant = this.artikles[this.artikelIndex].kreditorId;
        this.lagerPlatz.artId = this.artikles[this.artikelIndex].artikelid;
      }
    });
  }
  fillPlatz(data: LagerPlatzMitId) {
    if (this.currentArtikelMenge === 0) {
      this.toaster.error('Du musst artikel menge eingeben! ', 'Menge Error', {
        timeOut: 800,
      });
      return;
    } else if (
      this.currentArtikelMenge > this.artikles[this.artikelIndex].menge
    ) {
      this.toaster.error(
        ' Artikel menge darft nicht größe sein als menge in auftrag',
      );
      return;
    }
    if (data === undefined || data === null) {
      //TODO;
    }
    this.lagerPlatz = new LagerPlatztDto();
    this.lagerPlatz.id = data.id;
    this.lagerPlatz.lagerplatz = data.lagerplatz;
    this.lagerPlatz.prufziffern = data.prufziffern;
    this.lagerPlatz.artId = this.artikles[this.artikelIndex].artikelid;
    this.lagerPlatz.palettenTyp = this.paletteTyp;
    this.lagerPlatz.liferant = this.artikles[this.artikelIndex].kreditorId;
    this.lagerPlatz.artikelMenge = 0;
    this.lagerPlatz.artikelMenge = this.currentArtikelMenge;
    if (this.mhd !== undefined) {
      this.lagerPlatz.mhd = this.mhd;
    }
  }
  createPlatz() {
    if (this.currentArtikelMenge === 0) {
      this.toaster.error('Du musst artikel menge eingeben! ', 'Menge Error', {
        timeOut: 800,
      });
      return;
    } else if (
      this.currentArtikelMenge > this.artikles[this.artikelIndex].menge
    ) {
      this.toaster.error(
        ' Artikel menge darft nicht größe sein als menge in auftrag',
      );
      return;
    }
    this.lagerPlatz = new LagerPlatztDto();
    this.manualLagerPlatz =
      'gib ein lagerpaltz oder beschreibe es, zb. and der wand';
    const tmp: LagerPlatztDto = new LagerPlatztDto();
    tmp.artId = this.artikles[this.artikelIndex].artikelid;
    tmp.artikelMenge = this.artikles[this.artikelIndex].menge;
    if (this.mhd !== undefined) tmp.mhd = this.mhd;
    tmp.lagerplatz = this.manualLagerPlatz;
    tmp.palettenTyp = this.paletteTyp;
    tmp.liferant = this.artikles[this.artikelIndex].kreditorId;
    tmp.static = true;
    this.lagerPlatz = tmp;
  }
  setManualLagerPlatz(platz: any) {
    if (this.lagerPlatz !== undefined)
      this.lagerPlatz.lagerplatz = platz.target.value;
  }
  async lageEsEin() {
    if (this.lagerPlatz !== undefined) {
      if (
        this.prufziffern === undefined ||
        this.prufziffern !== this.lagerPlatz.prufziffern
      ) {
        this.toaster.error('Pruffzifern ist falsch!', 'Der Pruffzifern', {
          timeOut: 1000,
        });
        return;
      }
      //console.log(this.lagerPlatz);

      await this.warenServi.legeEs(this.lagerPlatz).subscribe((data) => {
        if (
          data !== null &&
          this.lagerPlatz !== undefined &&
          this.lagerPlatz.id === data.id
        ) {
          if (
            this.currentArtikelMenge === this.artikles[this.artikelIndex].menge
          ) {
            this.delArtikel();
            this.toaster.success('Ware gebucht', 'Warenbuchung', {
              timeOut: 600,
            });
          } else {
            const tmp: WarenEinArtikleDto = new WarenEinArtikleDto();
            tmp.artikelid = this.artikles[this.artikelIndex].artikelid;
            tmp.bestellungId = this.artikles[this.artikelIndex].bestellungId;
            tmp.aid = this.artikles[this.artikelIndex].aid;
            tmp.kreditorId = this.artikles[this.artikelIndex].kreditorId;
            tmp.menge = this.currentArtikelMenge;
            this.artikles[this.artikelIndex].menge -= this.currentArtikelMenge;
            this.warenServi.updateArtikel(tmp).subscribe((res) => {
              if (res === undefined || res === null) {
                this.toaster.error(
                  'etwas ist scheifgegangen als ich artikel editiren wollte',
                );
              }
            });
            this.toaster.success('Ware gebucht', 'Warenbuchung', {
              timeOut: 600,
            });
            this.show = 2;
            this.artikelIndex = -1;
            this.mhd = undefined;
            this.paletteTyp = PALETTENTYP.KEINPALETTE;
            this.currentArtikelMenge = 0;
            this.prufziffern = undefined;
          }
        } else {
          const err = new Error();
          Object.assign(err, data);
          this.toaster.error(err.message, 'Artikel Spiechern', {
            timeOut: 900,
          });
        }
      });
    }
  }
  async delArtikel() {
    await this.warenServi
      .delArtikel(
        this.artikles[this.artikelIndex].artikelid,
        this.artikles[this.artikelIndex].bestellungId,
      )
      .subscribe(() => {
        this.artikles.splice(this.artikelIndex, 1);
        if (this.artikles.length === 0) {
          this.getBuchungen();
        }
        this.show = 2;
        this.artikelIndex = -1;
        this.mhd = undefined;
        this.paletteTyp = PALETTENTYP.KEINPALETTE;
        this.currentArtikelMenge = 0;
        this.prufziffern = undefined;
      });
  }
}
