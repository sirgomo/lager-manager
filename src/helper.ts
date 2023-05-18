import { ArtikelDTO } from './DTO/artikelDTO';
import { ArtikelMengeDTO } from './DTO/artikelMengeDTO';
import { PalettenMengeVorausDTO } from './DTO/palettenMengeVorausDTO';
import { ARTIKELFLAGE } from './entity/artikelEntity';
import { InKomissPalletenEntity } from './entity/inKomissPalletenEntity';

export class Helper {
  //1
  public generateLager = false;
  //2
  public fullLageraus = false;
  public getPaletenVolumen(
    artMenge: number,
    grosse: string,
    minLosMenge: number,
    palMaxHcm: number,
  ) {
    const paleteMaxVolumen: number = 120 * 80 * (palMaxHcm - 15);
    let artGross: string[] = [];
    //hxbxl 31 x16x28c
    artGross = grosse.split('x');
    const kartonH = Number(artGross[0]);
    const kartonB = Number(artGross[1]);
    const kartonL = Number(artGross[2]);
    let mengeKarton: number = Math.floor(artMenge / minLosMenge);
    const rest: number = artMenge % minLosMenge;

    //TODO cos tu nie gra ! z volumenem jak wybiera i ustawia !
    const volMenge: number[][] = [];
    if (rest > 0 && artMenge < minLosMenge) {
      console.log('jak czesto');
      volMenge.push([kartonB * kartonH * kartonL, 1]);
      return volMenge;
    }
    const maxMengeKartonsOnH: number = Math.floor((palMaxHcm - 15) / kartonH);
    const paletteVolumen: number = 120 * 80 * 14.5;

    let mengeOn1 = 0;
    let mengeOn2 = 0;
    const breiteOnBreite: number = Math.floor(80 / kartonB);
    const langeOnLange: number = Math.floor(120 / kartonL);
    const plazOnLange: number = 120 - langeOnLange * kartonL;
    const platzOnBrite: number = 80 - breiteOnBreite * kartonB;
    mengeOn1 = breiteOnBreite * langeOnLange;
    if (plazOnLange > kartonB) {
      mengeOn1 += Math.floor(plazOnLange / kartonB) * Math.floor(80 / kartonL);
    }
    if (platzOnBrite > kartonL) {
      mengeOn1 +=
        Math.floor(platzOnBrite / kartonL) * Math.floor(120 / kartonL);
    }

    const langeOnBreite2: number = Math.floor(80 / kartonL);
    const breiteOnLange2: number = Math.floor(120 / kartonB);
    const plazOnLange2: number = 120 - breiteOnLange2 * kartonB;
    const platzOnBrite2: number = 80 - langeOnBreite2 * kartonL;
    mengeOn2 = langeOnBreite2 * breiteOnLange2;
    if (plazOnLange2 > kartonL) {
      mengeOn2 += Math.floor(plazOnLange2 / kartonL) * Math.floor(80 / kartonB);
    }
    if (platzOnBrite2 > kartonB) {
      mengeOn2 +=
        Math.floor(platzOnBrite2 / kartonB) * Math.floor(120 / kartonL);
    }

    if (mengeOn1 > mengeOn2) {
      while (mengeKarton > 0) {
        let kartons: number = mengeOn1 * maxMengeKartonsOnH;
        mengeKarton > kartons ? kartons : (kartons = mengeKarton);
        let kartonvol: number = this.getTotalKartonValue(
          kartons,
          kartonH,
          kartonB,
          kartonL,
        );
        const itemMengeOnPalete: number = kartons * minLosMenge;
        kartons === mengeKarton ? itemMengeOnPalete + rest : itemMengeOnPalete;
        kartonvol += paletteVolumen;
        volMenge.push([kartonvol, itemMengeOnPalete]);
        mengeKarton -= kartons;
      }
    } else {
      while (mengeKarton > 0) {
        let kartons: number = mengeOn2 * maxMengeKartonsOnH;
        mengeKarton > kartons ? kartons : (kartons = mengeKarton);
        let kartonvol: number = this.getTotalKartonValue(
          kartons,
          kartonH,
          kartonB,
          kartonL,
        );
        const itemMengeOnPalete: number = kartons * minLosMenge;
        kartons === mengeKarton ? itemMengeOnPalete + rest : itemMengeOnPalete;
        kartonvol += paletteVolumen;
        volMenge.push([kartonvol, itemMengeOnPalete]);
        mengeKarton -= kartons;
      }
    }
    /* console.log('max karton bxL : ' + maxKartonProLageBxL + ' max karton lxb : ' + maxKartonProLageLxB + ' Lagevolumen : ' + lageVolumen 
        +' bxL Volumen ' + this.getTotalKartonValue(maxKartonProLageBxL, kartonH, kartonB, kartonL) + 
        ' lxb volumen ' + this.getTotalKartonValue(maxKartonProLageLxB, kartonH, kartonB, kartonL) );*/
    volMenge.reverse();
    return volMenge;
  }
  private getTotalKartonValue(
    mengeK: number,
    kartonH: number,
    kartonB: number,
    kartonL: number,
  ) {
    return kartonL * kartonB * kartonH * mengeK;
  }
  public getRandomMhd() {
    const data: Date = new Date(
      2020 + this.getRandomInt(0, 5),
      this.getRandomInt(0, 11),
      this.getRandomInt(1, 30),
    );
    return data;
  }
  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  public getVolumenNeueUndAlt(artikel: ArtikelDTO, artMen: ArtikelMengeDTO) {
    const artGross = artikel.grosse.split('x');
    const kartonH = Number(artGross[0]);
    const kartonB = Number(artGross[1]);
    const kartonL = Number(artGross[2]);
    const kartonMengecurrent: number = Math.floor(
      artikel.bestand / artikel.minLosMenge,
    );
    const kartonNew: number = Math.floor(artMen.menge / artikel.minLosMenge);
    const volOnStel: number = kartonH * kartonB * kartonL * kartonMengecurrent;
    const volNeue: number = kartonH * kartonB * kartonL * kartonNew;

    return volOnStel + volNeue;
  }
  public getTotalPalettenMenge(
    palMaxHo: number,
    artikels: PalettenMengeVorausDTO[],
    komissId: number,
  ) {
    const whileStop = 0;
    const sussKram: PalettenMengeVorausDTO[] = [];
    const alkKram: PalettenMengeVorausDTO[] = [];
    const fassKram: PalettenMengeVorausDTO[] = [];
    const tmpArrayFurRestMengeArtikel: PalettenMengeVorausDTO[] = [];
    const palettenMenge: InKomissPalletenEntity[] = [];
    let totalGewichtAltWeise = 0;
    const totalPaletenMengeAltWeise = 0;
    totalGewichtAltWeise = this.artikelsAuftailen(
      artikels,
      totalGewichtAltWeise,
      alkKram,
      fassKram,
      sussKram,
    );
    console.log(
      'sus ' +
        sussKram.length +
        ' alk ' +
        alkKram.length +
        ' fass ' +
        fassKram.length,
    );

    //TODO was machen wir hiere nacher ?
  }

  private getMengen(alkKram: PalettenMengeVorausDTO[], i: number) {
    const { kH, kB, kL }: { kH: number; kB: number; kL: number } =
      this.getMassen(alkKram, i);
    let palete = '';
    let mengeOn1 = 0;
    let mengeOn2 = 0;
    const breiteOnBreite: number = Math.floor(80 / kB);
    const langeOnLange: number = Math.floor(120 / kL);
    const plazOnLange: number = 120 - langeOnLange * kL;
    const platzOnBrite: number = 80 - breiteOnBreite * kB;
    mengeOn1 = breiteOnBreite * langeOnLange;
    if (plazOnLange > kB) {
      mengeOn1 += Math.floor(plazOnLange / kB) * Math.floor(80 / kL);
    }
    if (platzOnBrite > kL) {
      mengeOn1 += Math.floor(platzOnBrite / kL) * Math.floor(120 / kB);
    }

    const langeOnBreite2: number = Math.floor(80 / kL);
    const breiteOnLange2: number = Math.floor(120 / kB);
    const plazOnLange2: number = 120 - breiteOnLange2 * kB;
    const platzOnBrite2: number = 80 - langeOnBreite2 * kL;
    mengeOn2 = langeOnBreite2 * breiteOnLange2;
    if (plazOnLange2 > kL) {
      mengeOn2 += Math.floor(plazOnLange2 / kL) * Math.floor(80 / kB);
    }
    if (platzOnBrite2 > kB) {
      mengeOn2 += Math.floor(platzOnBrite2 / kB) * Math.floor(120 / kL);
    }
    for (let b = 0; b < 80; b++) {
      for (let l = 0; l < 120; l++) {
        if (b === 0 || b === 79 || l === 0 || l === 119) {
          palete += '#';
        } else if (mengeOn1 > mengeOn2) {
          if (
            (b % kB === 0 && b < 79 - platzOnBrite) ||
            (l % kL === 0 && l < 119 - plazOnLange)
          ) {
            palete += 'x';
          } else if (
            (b > 79 - platzOnBrite && b % kL === 0) ||
            (l > 119 - plazOnLange && l % kB === 0)
          ) {
            palete += 'y';
          } else {
            palete += ' ';
          }
        } else {
          if (
            (b % kL === 0 && b < 79 - platzOnBrite2) ||
            (l % kB === 0 && l < 119 - plazOnLange2)
          ) {
            palete += 'x';
          } else if (
            (b > 79 - platzOnBrite2 && b % kB === 0) ||
            (l > 119 - plazOnLange2 && l % kL === 0)
          ) {
            palete += 'y';
          } else {
            palete += ' ';
          }
        }

        if (l === 119) {
          palete += '\n';
        }
      }
    }
    let mengeOnLage = 0;
    if (mengeOn1 > mengeOn2) {
      mengeOnLage = mengeOn1;
    } else {
      mengeOnLage = mengeOn2;
    }
    return { mengeOnLage, palete };
  }

  private getMassen(alkKram: PalettenMengeVorausDTO[], i: number) {
    let masse: string[] = [];
    masse = alkKram[i].grosse.split('x');
    //hxbxl 31 x16x28c
    const kH = Number(masse[0]);
    const kB = Number(masse[1]);
    const kL = Number(masse[2]);
    return { kH, kB, kL };
  }

  private artikelsAuftailen(
    artikels: PalettenMengeVorausDTO[],
    totalGewichtAltWeise: number,
    alkKram: PalettenMengeVorausDTO[],
    fassKram: PalettenMengeVorausDTO[],
    sussKram: PalettenMengeVorausDTO[],
  ) {
    for (let i = 0; i !== artikels.length; i++) {
      totalGewichtAltWeise += artikels[i].gewicht;

      if (artikels[i].artikelFlage === ARTIKELFLAGE.ALK) {
        alkKram.push(artikels[i]);
      } else if (artikels[i].artikelFlage === ARTIKELFLAGE.FASS) {
        fassKram.push(artikels[i]);
      } else {
        sussKram.push(artikels[i]);
      }
    }

    return totalGewichtAltWeise;
  }

  public makePalId(length) {
    let result = '';
    const characters = '1234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return Number(result);
  }
}
