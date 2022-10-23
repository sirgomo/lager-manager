
import { artikelEntity, artikelFlage } from "./entity/artikelEntity";
import { uiidEntity } from "./entity/uiidEntity";

export class artLoader{

    makeArtikels() : artikelEntity[]{
        const arti : artikelEntity[] = new Array(1000);
        console.log('generuje');
       
        for (let i = 0; i < 1000; i++){
            if(Math.random() < 0.3){
                var artike : artikelEntity = new artikelEntity();
                var uid = new uiidEntity();
                artike.name = 'suss' + Math.random();
                artike.basisEinheit = 1;
                artike.durchschnittlicheLagerdauer = 20;
                artike.durschnittlicherLagerbestand = 300;
                artike.gewicht = this.getRandomInt(2,15);
                //hxbxl
                artike.grosse = this.getRandomInt(5,20) + 'x' + this.getRandomInt(5,40) + 'x' + this.getRandomInt(5,60);
                artike.minLosMenge = 6;
                uid.uid = 'askdjalsdj' + Math.random();
                artike.uids = [uid];
                artike.artikelFlage = artikelFlage.SUSS;
                //artike.mhd = new Date(this.getRandomInt(2023,2024), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);
                artike.umschlagshaufigkeit = 30;
                artike.bestand = this.getRandomInt(2,1000);
                arti[i] = artike;
            }else{
                var artike : artikelEntity = new artikelEntity();
                var uid = new uiidEntity();
                artike.name = 'alk' + Math.random();
                artike.basisEinheit = 1;
                artike.durchschnittlicheLagerdauer = 20;
                artike.durschnittlicherLagerbestand = 300;
                artike.gewicht = this.getRandomInt(2,25);
                //hxbxl
                artike.grosse = this.getRandomInt(5,40) + 'x' + this.getRandomInt(10,40) + 'x' + this.getRandomInt(10,40);
                artike.minLosMenge = 6;
                uid.uid = 'askdjalsdj' + Math.random();
                artike.uids = [uid];
                artike.artikelFlage = artikelFlage.ALK;
              //  artike.mhd = new Date(this.getRandomInt(2023,2026), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);
                artike.umschlagshaufigkeit = 30;
                artike.bestand = this.getRandomInt(2,1000);
                arti[i] = artike;
            }
           
        }
        return arti;
    }
    private getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); 
      }
}