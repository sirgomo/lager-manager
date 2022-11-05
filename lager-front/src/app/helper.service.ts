import { Injectable } from '@angular/core';
import { ArtikelDTO } from './dto/artikel.dto';
import { LagerPlatztDto } from './dto/lagerPlatz.dto';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
public  onSearch(text : string, artikels : ArtikelDTO[]){
    let tmpArrNew : ArtikelDTO[] = new Array();




   for (let o = 0; o < artikels.length; o++) {
        let tmpArr = Array.from(text);
        let tmpArr1 = Array.from(artikels[o].name);

        let atmp: number = 0;
      try{
        for (let i = 0; i < tmpArr.length; i++) {
          if (tmpArr[i].toLocaleLowerCase().trim() == tmpArr1[i].toLocaleLowerCase().trim()) {
            atmp += 1;
          }
        }
      } catch(err){
       // console.log(err);
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


 for (let o = 0; o < artikels.length; o++) {
      let tmpArr1 = new Array();
      let tmpArr = Array.from(text);
      if(artikels[o].name !== null){
          tmpArr1 = Array.from(artikels[o].name);
      }
      let tmpArr2 = Array.from(artikels[o].lagerplatz);

      let atmp: number = 0;

      for (let i = 0; i < tmpArr.length; i++) {
        if(artikels[o].name !== null){
        if (tmpArr[i].toLocaleLowerCase().trim() == tmpArr1[i].toLocaleLowerCase().trim()) {
          atmp += 1;
        }
      }
       else if (tmpArr[i].toLocaleLowerCase().trim() == tmpArr2[i].toLocaleLowerCase().trim()) {
          atmp += 1;
        }
      }

      if (atmp == tmpArr.length && !isFinite(Number(text))) {
         tmpArrNew.push(artikels[o]);
         artikels.splice(o, 1);
     }
     if(isFinite(Number(text)) ){
       if(isFinite(Number(text)) && artikels[o].artId === Number(text)){
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
