
import { ArtService } from "./artikel/art.service";
import { ArtikelEntity, artikelFlage } from "./entity/ArtikelEntity";
import { UiidEntity } from "./entity/UiidEntity";

export class ArtLoader{

    //constructor(private servi : ArtService){}
    servi : ArtService;
   public makeArtikels() : ArtikelEntity[]{
        const arti : ArtikelEntity[] = new Array(1000);
        console.log('generuje');
       
        for (let i = 0; i < 1000; i++){
            if(Math.random() < 0.3){
                let artike : ArtikelEntity = new ArtikelEntity();
                let uid = new UiidEntity();
                artike.name = this.makeName(8);
                artike.basisEinheit = 1;
                artike.gewicht = this.getRandomInt(2,15);
                //hxbxl
                artike.grosse = this.getRandomInt(5,20) + 'x' + this.getRandomInt(5,40) + 'x' + this.getRandomInt(5,60);
                artike.minLosMenge = 6;
                uid.uid = Math.random().toString();
                artike.uids = [uid];
                artike.artikelFlage = artikelFlage.SUSS;
                //artike.mhd = new Date(this.getRandomInt(2023,2024), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);
             
                artike.bestand = this.getRandomInt(2,1000);
                artike.artikelPrice = Math.round(( (this.getRandomInt(1,100) + Math.random()) * 100) / 100);
                artike.verPrice = artike.artikelPrice + artike.artikelPrice * 0.05;
                arti[i] = artike;
            }else{
                let artike : ArtikelEntity = new ArtikelEntity();
                let uid = new UiidEntity();
                artike.name = this.makeName(8);
                artike.basisEinheit = 1;
                artike.gewicht = this.getRandomInt(2,25);
                //hxbxl
                artike.grosse = this.getRandomInt(5,40) + 'x' + this.getRandomInt(10,40) + 'x' + this.getRandomInt(10,40);
                artike.minLosMenge = 6;
                uid.uid =  Math.random().toString();
                artike.uids = [uid];
                artike.artikelFlage = artikelFlage.ALK;
              //  artike.mhd = new Date(this.getRandomInt(2023,2026), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);
                artike.bestand = this.getRandomInt(2,1000);
                artike.artikelPrice = Math.round(( (this.getRandomInt(1,100) + Math.random()) * 100) / 100);
                artike.verPrice = artike.artikelPrice + artike.artikelPrice * 0.05;
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
      private makeName(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
   
}