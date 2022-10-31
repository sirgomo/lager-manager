
import { LagerPlatztDTO } from "./DTO/lagerPlatztDTO";
import { LagerService } from "./lager/lager.service";

export class LagerPlatzGenerator{
     regalMenge : number = 21;
     regalLange :number = 59;
     regalEbene : number = 4;
     palatenRegal : boolean = true;
     regalMitDopellplatz : boolean = false;
     regalEbene0 : number = 190;
     regalEbene1 : number = 170;
     regalEbene2 : number = 170;
     regalEbene3 : number = 200;
     regalEbene03 : number = 120;
     stelPlatzBreite : number = 90;
     stelPlatzTeife : number = 120;
    StellPlatze : LagerPlatztDTO[] = new Array();
   
  public getRegals(){
    this.StellPlatze.splice(0, this.StellPlatze.length);
        for(let i = 1; i<= this.regalMenge; i++){
            for(let y = 1; y<= this.regalLange; y++){
                    if(y > 56){
                        for(let e5 = 0; e5 < 5; e5++){
                            if(e5 < 3){
                                let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                                let stellplazt1 : LagerPlatztDTO = new LagerPlatztDTO;
                                //lxhxb
                                stellplazt.lagerPlatzVolumen = 120 * 120 * 40;
                                stellplazt1.lagerPlatzVolumen = 120 * 120 * 40;
                                stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e5; 
                                stellplazt1.lagerplatz = '' + i + '-' + y + '-'+ '02-' + e5;
                                stellplazt.static = true;
                                stellplazt1.static = true;
                                this.StellPlatze.push(stellplazt);
                                this.StellPlatze.push(stellplazt1);
                            }
                           else if(e5 == 3)
                            {
                            let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                           
                            //lxhxb
                            stellplazt.lagerPlatzVolumen = 120 * 170 * 80;
                            stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e5; 
                            stellplazt.static = false; 
                            this.StellPlatze.push(stellplazt);
                            }else{
                            let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                           
                            //lxhxb
                            stellplazt.lagerPlatzVolumen = 120 * 220 * 80;
                            stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e5; 
                            stellplazt.static = false; 
                            this.StellPlatze.push(stellplazt);
                            }
                            
                           
                           
                        }
                    }
                    for(let e4 = 0; e4 < 4; e4++){
                        if(e4 == 0)
                        {
                            let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                           
                            //lxhxb
                            stellplazt.lagerPlatzVolumen = 120 * 190 * 80;
                            stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e4; 
                            stellplazt.static = true; 
                            this.StellPlatze.push(stellplazt);
                        }
                      else  if(e4 == 1 || e4 == 2  )
                        {
                            let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                           
                            //lxhxb
                            stellplazt.lagerPlatzVolumen = 120 * 170 * 80;
                            stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e4; 
                            stellplazt.static = false; 
                            this.StellPlatze.push(stellplazt);
                        }else{
                            let stellplazt : LagerPlatztDTO = new LagerPlatztDTO;
                           
                            //lxhxb
                            stellplazt.lagerPlatzVolumen = 120 * 220 * 80;
                            stellplazt.lagerplatz = '' + i + '-' + y + '-' + '01-' + e4; 
                            stellplazt.static = false; 
                            this.StellPlatze.push(stellplazt);
                        }
                    }
            }
        }
       return this.StellPlatze;
    }
   
}