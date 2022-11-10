import { Injectable } from '@angular/core';
import { ArtikelDTO } from './dto/artikel.dto';
import { LagerPlatztDto } from './dto/lagerPlatz.dto';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
public  onSearch(text : string, artikels : ArtikelDTO[]){
  if(text === undefined || text.length === 0){
    return artikels;
  }
    let tmpArrNew : ArtikelDTO[] = new Array();




   for (let o = 0; o < artikels.length; o++) {
        let tmpArr = Array.from(text);
        let tmpArr1 = Array.from(artikels[o].name);

        let atmp: number = 0;

        for (let i = 0; i < tmpArr.length; i++) {
          if (tmpArr[i].toLocaleLowerCase().trim() == tmpArr1[i].toLocaleLowerCase().trim()) {
            atmp += 1;
          }
        }

        if (atmp == tmpArr.length && o > 5) {
           tmpArrNew.push(artikels[o]);
           artikels.splice(o, 1);
       }
       if(isFinite(Number(text)) && o > 5){
         if(isFinite(Number(text)) && artikels[o].artikelId === Number(text)){
           tmpArrNew.push(artikels[o]);
           artikels.splice(o, 1);
         }
       }

    }


      tmpArrNew.forEach(d => {
        artikels.unshift(d);
     })
return artikels;
 }

 public onSearchPlatz(text : string, platze: LagerPlatztDto[]){
  let tmpArrNew : LagerPlatztDto[] = new Array();
  if(text === undefined || text.length === 0){
    return platze;
  }

 for (let o = 0; o !== platze.length; o++) {
      let tmpArr1 :string[] = new Array();
      let tmpArr2: string[] = new Array();
      let tmpArr :string[] = Array.from(text.toString());
      if(platze[o] !== undefined && platze[o].name !== undefined && platze[o].name !== null){
          tmpArr1 = Array.from(platze[o].name);
      }
      if(platze[o] !== undefined && platze[o].lagerplatz !== undefined && platze[o].lagerplatz !== null){
       tmpArr2  = Array.from(platze[o].lagerplatz.toString());
      }


      let atmp: number = 0;
      let atmp2: number = 0;

      for (let i = 0; i !== tmpArr.length; i++) {
            if( tmpArr1[i] !== undefined && platze[o].name !== undefined && platze[o].name !== null ){
            if (tmpArr[i].toLocaleLowerCase().trim() === tmpArr1[i].toLocaleLowerCase().trim()) {
              atmp += 1;
            }
          }

          if( tmpArr2[i] !== undefined && platze[o].lagerplatz !== null && platze[o].lagerplatz !== undefined ){
            if(tmpArr2[i] === tmpArr[i])  atmp2 += 1;
          }
         }

      if (atmp == tmpArr.length && atmp > atmp2 ) {
         tmpArrNew.push(platze[o]);
         platze.splice(o, 1);
         console.log('atmp');
     }
      if (atmp2 == tmpArr.length && atmp2 > atmp && !isFinite(Number(text))) {
      tmpArrNew.push(platze[o]);
      platze.splice(o, 1);
      console.log('atmp2');
    }

       if(platze[o] !== undefined && platze[o].artId !== undefined && platze[o].artId !== null && isFinite(Number(text))){
        if(isFinite(platze[o].artId) && platze[o].artId == Number(text) ){
          tmpArrNew.push(platze[o]);
          platze.splice(o, 1);
          console.log('id')
        }

       }


  }
    tmpArrNew.forEach(d => {
      platze.unshift(d);
   });
return platze;
}
}
