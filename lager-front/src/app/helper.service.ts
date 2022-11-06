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

 public onSearchPlatz(text : string, artikels: LagerPlatztDto[]){
  let tmpArrNew : LagerPlatztDto[] = new Array();
  if(text === undefined || text.length === 0){
    return artikels;
  }

 for (let o = 0; o < artikels.length; o++) {
      let tmpArr1 :string[] = new Array();
      let tmpArr :string[] = Array.from(text.toString());
      if(artikels[o] !== undefined && artikels[o].name !== undefined && artikels[o].name !== null){
          tmpArr1 = Array.from(artikels[o].name);
      }
      let tmpArr2: string[] = Array.from(artikels[o].lagerplatz);

      let atmp: number = 0;
      let atmp2: number = 0;

      for (let i = 0; i < tmpArr.length; i++) {
        if( tmpArr1[i] !== undefined && artikels[o].name !== undefined && artikels[o].name !== null ){
        if (tmpArr[i].toLocaleLowerCase().trim() === tmpArr1[i].toLocaleLowerCase().trim()) {
          atmp += 1;
        }
      }

      if( tmpArr2[i] !== undefined && artikels[o].lagerplatz !== null && artikels[o].lagerplatz !== undefined ){
        if (tmpArr[i].toLocaleLowerCase().trim() === tmpArr2[i].toLocaleLowerCase().trim()) {
          atmp2 += 1;
        }
       }
      }

      if (atmp == tmpArr.length  || atmp2 == tmpArr2.length ) {
         tmpArrNew.push(artikels[o]);
         artikels.splice(o, 1);
     }

       if(artikels[o] !== undefined && artikels[o].artId !== undefined && artikels[o].artId !== null){
        if(isFinite(artikels[o].artId) && artikels[o].artId == Number(text)){
          tmpArrNew.push(artikels[o]);
          artikels.splice(o, 1);
        }

       }


  }
    tmpArrNew.forEach(d => {
      artikels.unshift(d);
   });
return artikels;
}
}
