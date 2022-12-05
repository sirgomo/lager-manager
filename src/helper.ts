import { ArtikelDTO } from "./DTO/ArtikelDTO";
import { ArtikelMengeDTO } from "./DTO/artikelMengeDTO";
import { PalettenMengeVorausDTO } from "./DTO/palettenMengeVorausDTO";
import { ARTIKELFLAGE } from "./entity/ArtikelEntity";
import { InKomissPalletenEntity } from "./entity/InKomissPalletenEntity";

export class Helper{
  //1
  public generateLager : boolean = false;
  //2
  public fullLageraus: boolean = false;
  public  getPaletenVolumen(artMenge: number, grosse: string, minLosMenge: number, palMaxHcm: number ){
        let paleteMaxVolumen : number = 120 * 80 * (palMaxHcm - 15);
        let artGross : string[] = new Array();
         //hxbxl 31 x16x28c
        artGross = grosse.split('x');
        let kartonH : number = Number(artGross[0]);
        let kartonB : number = Number(artGross[1]);
        let kartonL : number = Number(artGross[2]);
        let mengeKarton: number = Math.floor(artMenge / minLosMenge);
        let rest :number = artMenge % minLosMenge;
        
        //TODO cos tu nie gra ! z volumenem jak wybiera i ustawia !        
        let volMenge : number[][] = new Array();
      if( rest > 0 && artMenge < minLosMenge){
        console.log('jak czesto');
        volMenge.push([kartonB * kartonH * kartonL, 1]);
        return volMenge;
       }
        let maxMengeKartonsOnH : number = Math.floor( (palMaxHcm - 15) / kartonH);
        let paletteVolumen: number = 120 * 80 * 14.5;
       /* let maxKartonLangeOnL :number = Math.floor(120 / kartonL);
        let maxKartonLangeOnB : number = Math.floor(120 / kartonB);
        let maxKartonBreiteOnL : number = Math.floor(80 / kartonL);
        let maxKartonBreiteOnB :number = Math.floor(80 / kartonB);
        let maxKartonProLageLxB: number = maxKartonLangeOnL * maxKartonBreiteOnB;
        let maxKartonProLageBxL: number = maxKartonLangeOnB * maxKartonBreiteOnL;
        if((120 - maxKartonLangeOnL * kartonL) > kartonB){
          maxKartonProLageLxB += Math.floor(80 / kartonB);
          }
        if((80 - maxKartonBreiteOnL * kartonL) > kartonB){
          maxKartonProLageBxL += Math.floor(120 / kartonL);
         }*/
         let mengeOn1: number = 0;
         let mengeOn2: number = 0;
         let breiteOnBreite: number = Math.floor(80 / kartonB);
         let langeOnLange: number = Math.floor(120 / kartonL);
         let plazOnLange: number = 120 - langeOnLange * kartonL;
         let platzOnBrite: number = 80 - breiteOnBreite * kartonB;
         mengeOn1 = breiteOnBreite * langeOnLange;
         if (plazOnLange > kartonB) {
           mengeOn1 += Math.floor(plazOnLange / kartonB) * Math.floor(80 / kartonL);
         }
         if (platzOnBrite > kartonL) {
           mengeOn1 += Math.floor(platzOnBrite / kartonL) * Math.floor(120 / kartonL);
         }
     
     
         let langeOnBreite2: number = Math.floor(80 / kartonL);
         let breiteOnLange2: number = Math.floor(120 / kartonB);
         let plazOnLange2: number = 120 - breiteOnLange2 * kartonB;
         let platzOnBrite2: number = 80 - langeOnBreite2 * kartonL;
         mengeOn2 = langeOnBreite2 * breiteOnLange2;
         if (plazOnLange2 > kartonL) {
           mengeOn2 += Math.floor(plazOnLange2 / kartonL) * Math.floor(80 / kartonB);
         }
         if (platzOnBrite2 > kartonB) {
           mengeOn2 += Math.floor(platzOnBrite2 / kartonB) * Math.floor(120 / kartonL);
         }
        
       //  console.log('maxKartonProLageLxB ' + maxKartonProLageLxB +' i maxKartonProLageBxL '+ maxKartonProLageBxL);
        /*if(maxKartonProLageBxL > maxKartonProLageLxB){
          
            while(mengeKarton > 0){
                let kartons:number = maxKartonProLageBxL * maxMengeKartonsOnH;
                  mengeKarton > kartons ? kartons : kartons = mengeKarton;
                let kartonvol : number = this.getTotalKartonValue(kartons, kartonH, kartonB, kartonL);
                let itemMengeOnPalete: number = kartons * minLosMenge;
                  kartons === mengeKarton ? itemMengeOnPalete + rest : itemMengeOnPalete;
                kartonvol += paletteVolumen;
                volMenge.push([kartonvol, itemMengeOnPalete]);
                mengeKarton -= kartons;
            }
          

        }else {
            while(mengeKarton > 0){
                let kartons:number = maxKartonProLageLxB * maxMengeKartonsOnH;
                  mengeKarton > kartons ? kartons : kartons = mengeKarton;
                let kartonvol : number = this.getTotalKartonValue(kartons, kartonH, kartonB, kartonL);
                let itemMengeOnPalete: number = kartons * minLosMenge;
                  kartons === mengeKarton ? itemMengeOnPalete + rest : itemMengeOnPalete;
                kartonvol += paletteVolumen;
                volMenge.push([kartonvol, itemMengeOnPalete]);
                mengeKarton -= kartons;
            }
        }*/
        if(mengeOn1 > mengeOn2){
          
          while(mengeKarton > 0){
              let kartons:number = mengeOn1 * maxMengeKartonsOnH;
                mengeKarton > kartons ? kartons : kartons = mengeKarton;
              let kartonvol : number = this.getTotalKartonValue(kartons, kartonH, kartonB, kartonL);
              let itemMengeOnPalete: number = kartons * minLosMenge;
                kartons === mengeKarton ? itemMengeOnPalete + rest : itemMengeOnPalete;
              kartonvol += paletteVolumen;
              volMenge.push([kartonvol, itemMengeOnPalete]);
              mengeKarton -= kartons;
          }
        

      }else {
          while(mengeKarton > 0){
              let kartons:number = mengeOn2 * maxMengeKartonsOnH;
                mengeKarton > kartons ? kartons : kartons = mengeKarton;
              let kartonvol : number = this.getTotalKartonValue(kartons, kartonH, kartonB, kartonL);
              let itemMengeOnPalete: number = kartons * minLosMenge;
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
    private getTotalKartonValue( mengeK :number, kartonH:number, kartonB:number, kartonL: number){
        return (kartonL * kartonB * kartonH * mengeK);
    }
    public getRandomMhd(){
       let data: Date = new Date(2020 + this.getRandomInt(0, 5), this.getRandomInt(0,11), this.getRandomInt(1,30));
       return data;
    }
    private getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
      }
    public getVolumenNeueUndAlt(artikel :ArtikelDTO, artMen: ArtikelMengeDTO){
      let artGross = artikel.grosse.split('x');
      let kartonH : number = Number(artGross[0]);
      let kartonB : number = Number(artGross[1]);
      let kartonL : number = Number(artGross[2]);
      let kartonMengecurrent:number = Math.floor(artikel.bestand / artikel.minLosMenge);
      let kartonNew : number = Math.floor(artMen.menge / artikel.minLosMenge); 
      let volOnStel : number = kartonH * kartonB * kartonL * kartonMengecurrent;
      let volNeue : number = kartonH * kartonB * kartonL * kartonNew;

      return volOnStel + volNeue;
    }
public getTotalPalettenMenge(palMaxHo: number, artikels: PalettenMengeVorausDTO[], komissId: number){
    let whileStop:number = 0;
    let sussKram: PalettenMengeVorausDTO[] = new Array();
    let alkKram: PalettenMengeVorausDTO[] = new Array();
    let fassKram: PalettenMengeVorausDTO[] = new Array();
    let tmpArrayFurRestMengeArtikel: PalettenMengeVorausDTO[] = new Array();
    let palettenMenge : InKomissPalletenEntity[] = new Array();
    let totalGewichtAltWeise:number = 0;
    let totalPaletenMengeAltWeise: number = 0;
    totalGewichtAltWeise = this.artikelsAuftailen(artikels, totalGewichtAltWeise, alkKram, fassKram, sussKram);
    console.log('sus ' + sussKram.length + ' alk ' + alkKram.length + ' fass ' + fassKram.length);

    //TODO was machen wir hiere nacher ? 
  
} 






  private getMengen(alkKram: PalettenMengeVorausDTO[], i: number) {
    let {kH, kB, kL }: {kH:number, kB: number; kL: number; } = this.getMassen(alkKram, i);
    let palete: string = '';
    let mengeOn1: number = 0;
    let mengeOn2: number = 0;
    let breiteOnBreite: number = Math.floor(80 / kB);
    let langeOnLange: number = Math.floor(120 / kL);
    let plazOnLange: number = 120 - langeOnLange * kL;
    let platzOnBrite: number = 80 - breiteOnBreite * kB;
    mengeOn1 = breiteOnBreite * langeOnLange;
    if (plazOnLange > kB) {
      mengeOn1 += Math.floor(plazOnLange / kB) * Math.floor(80 / kL);
    }
    if (platzOnBrite > kL) {
      mengeOn1 += Math.floor(platzOnBrite / kL) * Math.floor(120 / kB);
    }


    let langeOnBreite2: number = Math.floor(80 / kL);
    let breiteOnLange2: number = Math.floor(120 / kB);
    let plazOnLange2: number = 120 - breiteOnLange2 * kB;
    let platzOnBrite2: number = 80 - langeOnBreite2 * kL;
    mengeOn2 = langeOnBreite2 * breiteOnLange2;
    if (plazOnLange2 > kL) {
      mengeOn2 += Math.floor(plazOnLange2 / kL) * Math.floor(80 / kB);
    }
    if (platzOnBrite2 > kB) {
      mengeOn2 += Math.floor(platzOnBrite2 / kB) * Math.floor(120 / kL);
    }
    for (let b = 0; b < 80; b++) {
      for (let l = 0; l < 120; l++) {
        if(b === 0 || b === 79 || l === 0 || l === 119){
          palete += '#';
        }
        else if (mengeOn1 > mengeOn2) {
          if (b % kB === 0 && b <  79 - platzOnBrite || l % kL === 0 && l < 119 - plazOnLange) {
            palete += 'x';
          } else if (b > 79 - platzOnBrite && b % kL === 0 || l > 119 - plazOnLange && l % kB === 0) {
            palete += 'y';
          } else {
            palete += ' ';
          }
        } else {
          if (b % kL === 0 && b < 79 - platzOnBrite2 || l % kB === 0 && l < 119 - plazOnLange2) {
            palete += 'x';
          } else if (b > 79 - platzOnBrite2 && b % kB === 0 || l > 119 - plazOnLange2 && l % kL === 0) {
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
    let mengeOnLage:number = 0;
    if(mengeOn1 > mengeOn2){
      mengeOnLage = mengeOn1;
    }else{
      mengeOnLage = mengeOn2;
    }
    return {mengeOnLage, palete};
  }

  private getMassen(alkKram: PalettenMengeVorausDTO[], i: number) {
    let masse: string[] = new Array();
    masse = alkKram[i].grosse.split('x');
    //hxbxl 31 x16x28c
    let kH: number = Number(masse[0]);
    let kB: number = Number(masse[1]);
    let kL: number = Number(masse[2]);
    return {kH, kB, kL };
  }

  private artikelsAuftailen(artikels: PalettenMengeVorausDTO[], totalGewichtAltWeise: number, alkKram: PalettenMengeVorausDTO[], fassKram: PalettenMengeVorausDTO[], sussKram: PalettenMengeVorausDTO[]) {
    for (let i = 0; i !== artikels.length; i++) {
      totalGewichtAltWeise +=  artikels[i].gewicht;

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

  private makePalId(length) {
    var result           = '';
    var characters       = '1234567890';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return Number(result);
  }
}