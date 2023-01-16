import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { ArtikelDTO, ARTIKELFLAGE } from './dto/artikel.dto';
import { ArtikelKommissDto } from './dto/artikelKommiss.dto';
import { LagerPlatztDto } from './dto/lagerPlatz.dto';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  public toolbarInfo: Subject<string[]>;
  private sidenav: MatSidenav | undefined;
  constructor() {
    this.toolbarInfo = new Subject();
  }
  public onSearch(text: string, artikels: ArtikelDTO[]) {
    if (text === undefined || text.length === 0) {
      return artikels;
    }
    const tmpArrNew: ArtikelDTO[] = [];
    for (let o = 0; o < artikels.length; o++) {
      const tmpArr = Array.from(text);
      const tmpArr1 = Array.from(artikels[o].name);

      let atmp = 0;

      for (let i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i] === undefined || tmpArr1[i] === undefined) {
          break;
        }
        if (
          tmpArr[i].toLocaleLowerCase().trim() ==
          tmpArr1[i].toLocaleLowerCase().trim()
        ) {
          atmp += 1;
        }
      }

      if (atmp == tmpArr.length && o > 5) {
        tmpArrNew.push(artikels[o]);
        artikels.splice(o, 1);
      }
      if (isFinite(Number(text)) && o > 5) {
        if (isFinite(Number(text)) && artikels[o].artikelId == Number(text)) {
          tmpArrNew.push(artikels[o]);
          artikels.splice(o, 1);
        }
      }
    }

    tmpArrNew.forEach((d) => {
      artikels.unshift(d);
    });
    return artikels;
  }

  public onSearchK(text: string, artikels: ArtikelKommissDto[]) {
    if (text === undefined || text === null || text.length === 0) {
      return artikels;
    }
    const tmpArrNew: ArtikelKommissDto[] = [];

    for (let o = 0; o < artikels.length; o++) {
      if (artikels[o] === undefined || artikels[o].name === null) break;
      const tmpArr = Array.from(text);
      const tmpArr1 = Array.from(artikels[o].name);

      let atmp = 0;

      for (let i = 0; i < tmpArr.length; i++) {
        if (tmpArr[i] === undefined || tmpArr1[i] === undefined) break;

        if (
          tmpArr[i].toLocaleLowerCase().trim() ==
          tmpArr1[i].toLocaleLowerCase().trim()
        ) {
          atmp += 1;
        }
      }

      if (atmp == tmpArr.length && o > 5) {
        tmpArrNew.push(artikels[o]);
        artikels.splice(o, 1);
      }
      if (isFinite(Number(text)) && o > 5) {
        if (isFinite(Number(text)) && artikels[o].artId == Number(text)) {
          tmpArrNew.push(artikels[o]);
          artikels.splice(o, 1);
        }
      }
    }

    tmpArrNew.forEach((d) => {
      artikels.unshift(d);
    });
    return artikels;
  }
  public onSearchPlatz(text: string, platze: LagerPlatztDto[]) {
    const tmpArrNew: LagerPlatztDto[] = [];
    if (text === undefined || text.length === 0) {
      return platze;
    }

    for (let o = 0; o !== platze.length; o++) {
      let tmpArr1: string[] = [];
      let tmpArr2: string[] = [];
      const tmpArr: string[] = Array.from(text.toString());
      if (
        platze[o] !== undefined &&
        platze[o].name !== undefined &&
        platze[o].name !== null
      ) {
        tmpArr1 = Array.from(platze[o].name);
      }
      if (
        platze[o] !== undefined &&
        platze[o].lagerplatz !== undefined &&
        platze[o].lagerplatz !== null
      ) {
        tmpArr2 = Array.from(platze[o].lagerplatz.toString());
      }

      let atmp = 0;
      let atmp2 = 0;

      for (let i = 0; i !== tmpArr.length; i++) {
        if (
          tmpArr1[i] !== undefined &&
          platze[o].name !== undefined &&
          platze[o].name !== null
        ) {
          if (
            tmpArr[i].toLocaleLowerCase().trim() ===
            tmpArr1[i].toLocaleLowerCase().trim()
          ) {
            atmp += 1;
          }
        }

        if (
          tmpArr2[i] !== undefined &&
          platze[o].lagerplatz !== null &&
          platze[o].lagerplatz !== undefined
        ) {
          if (tmpArr2[i] === tmpArr[i]) atmp2 += 1;
        }
      }

      if (atmp == tmpArr.length && atmp > atmp2) {
        tmpArrNew.push(platze[o]);
        platze.splice(o, 1);
        console.log('atmp');
      }
      if (atmp2 == tmpArr.length && atmp2 > atmp && !isFinite(Number(text))) {
        tmpArrNew.push(platze[o]);
        platze.splice(o, 1);
        console.log('atmp2');
      }

      if (
        platze[o] !== undefined &&
        platze[o].artId !== undefined &&
        platze[o].artId !== null &&
        isFinite(Number(text))
      ) {
        if (isFinite(platze[o].artId) && platze[o].artId == Number(text)) {
          tmpArrNew.push(platze[o]);
          platze.splice(o, 1);
          console.log('id');
        }
      }
    }
    tmpArrNew.forEach((d) => {
      platze.unshift(d);
    });
    return platze;
  }

  getPaletsDeatails(artikels: ArtikelKommissDto[]) {
    let totalGewicht = 0;
    let stellplattze = 0;
    let sussgewicht = 0;
    for (let i = 0; i !== artikels.length; i++) {
      if (artikels[i].ARTIKELFLAGE == ARTIKELFLAGE.FASS) {
        totalGewicht += Number(artikels[i].gewicht);
      }
      if (artikels[i].ARTIKELFLAGE == ARTIKELFLAGE.ALK) {
        totalGewicht += Number(artikels[i].gewicht);
      }
      if (artikels[i].ARTIKELFLAGE == ARTIKELFLAGE.SUSS) {
        sussgewicht += Number(artikels[i].gewicht);
      }
    }

    stellplattze = Number(Math.ceil(totalGewicht / 750));
    stellplattze += Number(Math.ceil(sussgewicht / 250));
    totalGewicht = totalGewicht + sussgewicht;

    return { stellplattze, totalGewicht };
  }
  public getErrorNachricht(data: any): string {
    const tmpErr: Error = new Error();
    Object.assign(tmpErr, data);
    return tmpErr.message;
  }
  public setToolbar(value: string[]) {
    this.toolbarInfo.next(value);
  }
  public setSideNav(nav: MatSidenav) {
    this.sidenav = nav;
  }
  public toggleSideNav() {
    if (this.sidenav !== undefined) this.sidenav.toggle();
  }
}
