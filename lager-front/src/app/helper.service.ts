import { Injectable } from '@angular/core';
import { ArtikelDTO } from './dto/artikel.dto';

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
}
