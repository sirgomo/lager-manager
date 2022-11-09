import { ArtikelDTO } from "./DTO/ArtikelDTO";
import { ArtikelMengeDTO } from "./DTO/artikelMengeDTO";

export class Helper{

  public  getPaletenVolumen(artMenge: number, grosse: string, minLosMenge: number, palMaxHcm: number ){
        let paleteMaxVolumen : number = 120 * 80 * palMaxHcm;
        let artGross : string[] = new Array();
         //hxbxl 31 x16x28c
        artGross = grosse.split('x');
        let kartonH : number = Number(artGross[0]);
        let kartonB : number = Number(artGross[1]);
        let kartonL : number = Number(artGross[2]);
        let mengeKarton: number = Math.floor(artMenge / minLosMenge);
        let rest :number = artMenge % minLosMenge;
        
        
        let volMenge : number[][] = new Array();
      if( rest > 0 && mengeKarton === 0){
        console.log('jak czesto');
        volMenge.push([kartonB * kartonH * kartonL, 1]);
        return volMenge;
       }
        let maxMengeKartonsOnH : number = Math.floor( (palMaxHcm - 15) / kartonH);
        let paletteVolumen: number = 120 * 80 * 14.5;
        let maxKartonLangeOnL :number = Math.floor(120 / kartonL);
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
         }

       //  console.log('maxKartonProLageLxB ' + maxKartonProLageLxB +' i maxKartonProLageBxL '+ maxKartonProLageBxL);
        if(maxKartonProLageBxL > maxKartonProLageLxB){
          
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

}