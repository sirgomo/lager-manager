import { ArtService } from './artikel/art.service';
import { ArtikelEntity, ARTIKELFLAGE } from './entity/artikelEntity';
import { UiidEntity } from './entity/uiidEntity';

export class ArtLoader {
  public gener = false;
  //constructor(private servi : ArtService){}
  servi: ArtService;
  public makeArtikels(): ArtikelEntity[] {
    const arti: ArtikelEntity[] = new Array(1000);
    console.log('generuje');

    for (let i = 0; i < 1000; i++) {
      if (Math.random() < 0.3) {
        const artike: ArtikelEntity = new ArtikelEntity();
        const uid = new UiidEntity();
        artike.name = this.makeName(8);
        artike.basisEinheit = 1;
        artike.gewicht = this.getRandomInt(2, 15);
        //hxbxl
        artike.grosse =
          this.getRandomInt(5, 20) +
          'x' +
          this.getRandomInt(5, 40) +
          'x' +
          this.getRandomInt(5, 60);
        artike.minLosMenge = 6;
        uid.uid = Math.random().toString();
        artike.uids = [uid];
        artike.artikelFlage = ARTIKELFLAGE.SUSS;
        //artike.mhd = new Date(this.getRandomInt(2023,2024), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);

        artike.bestand = this.getRandomInt(2, 1000);
        artike.verPrice = Math.round(
          ((this.getRandomInt(1, 100) + Math.random()) * 100) / 100,
        );
        artike.liferantId = this.getRandomInt(1, 5);
        artike.mehrwertsteuer = 6;
        artike.artikelId = this.makeId(5);
        artike.name2 = '';
        artike.longBeschriftung = '';
        artike.uids[0].artikelId = artike.artikelId;
        arti[i] = artike;
      } else {
        const artike: ArtikelEntity = new ArtikelEntity();
        const uid = new UiidEntity();
        artike.name = this.makeName(8);
        artike.basisEinheit = 1;
        artike.gewicht = this.getRandomInt(2, 25);
        //hxbxl
        artike.grosse =
          this.getRandomInt(5, 40) +
          'x' +
          this.getRandomInt(10, 40) +
          'x' +
          this.getRandomInt(10, 40);
        artike.minLosMenge = 6;
        uid.uid = Math.random().toString();
        artike.uids = [uid];
        artike.artikelFlage = ARTIKELFLAGE.ALK;
        //  artike.mhd = new Date(this.getRandomInt(2023,2026), this.getRandomInt(0,11) + 1, this.getRandomInt(0,28) + 1);
        artike.bestand = this.getRandomInt(2, 1000);
        artike.verPrice = Math.round(
          ((this.getRandomInt(1, 100) + Math.random()) * 100) / 100,
        );
        artike.liferantId = this.getRandomInt(1, 5);
        artike.mehrwertsteuer = 19;
        artike.artikelId = this.makeId(5);
        artike.name2 = '';
        artike.longBeschriftung = '';
        artike.uids[0].artikelId = artike.artikelId;
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
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  private makeId(length) {
    let result = '';
    const characters = '12345678901234567890';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return Number(result);
  }
}
