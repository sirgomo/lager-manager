import { LagerPlatztDTO } from './DTO/lagerPlatztDTO';

export class LagerPlatzGenerator {
  regalMenge = 21;
  regalLange = 59;
  regalEbene = 4;
  palatenRegal = true;
  regalMitDopellplatz = false;
  regalEbene0 = 190;
  regalEbene1 = 170;
  regalEbene2 = 170;
  regalEbene3 = 200;
  regalEbene03 = 120;
  stelPlatzBreite = 90;
  stelPlatzTeife = 120;
  StellPlatze: LagerPlatztDTO[] = [];

  public getRegals() {
    this.StellPlatze.splice(0, this.StellPlatze.length);
    for (let i = 1; i <= this.regalMenge; i++) {
      for (let y = 1; y <= this.regalLange; y++) {
        if (y > 56) {
          for (let e5 = 0; e5 < 5; e5++) {
            if (e5 < 3) {
              const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();
              const stellplazt1: LagerPlatztDTO = new LagerPlatztDTO();
              //lxhxb
              stellplazt.lagerPlatzVolumen = 120 * 120 * 40;
              stellplazt1.lagerPlatzVolumen = 120 * 120 * 40;

              stellplazt.lagerplatz = this.genLagerPlatz(i, y, e5);
              stellplazt1.lagerplatz = this.genLagerPlatz(i, y, e5);

              stellplazt.static = true;
              stellplazt1.static = true;
              stellplazt.prufziffern = 0;
              stellplazt.lagerid = 0;
              stellplazt.lagerName = 'lager';
              stellplazt1.prufziffern = 0;
              stellplazt1.lagerid = 0;
              stellplazt1.lagerName = 'lager';
              this.StellPlatze.push(stellplazt);
              this.StellPlatze.push(stellplazt1);
            } else if (e5 == 3) {
              const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();

              //lxhxb
              stellplazt.lagerPlatzVolumen = 120 * 170 * 80;

              stellplazt.lagerplatz = this.genLagerPlatz(i, y, e5);

              stellplazt.static = false;
              stellplazt.prufziffern = 0;
              stellplazt.lagerid = 0;
              stellplazt.lagerName = 'lager';
              this.StellPlatze.push(stellplazt);
            } else {
              const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();

              //lxhxb
              stellplazt.lagerPlatzVolumen = 120 * 220 * 80;

              stellplazt.lagerplatz = this.genLagerPlatz(i, y, e5);

              stellplazt.static = false;
              stellplazt.prufziffern = 0;
              stellplazt.lagerid = 0;
              stellplazt.lagerName = 'lager';
              this.StellPlatze.push(stellplazt);
            }
          }
        }
        for (let e4 = 0; e4 < 4; e4++) {
          if (e4 == 0 && y <= 56) {
            const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();

            //lxhxb
            stellplazt.lagerPlatzVolumen = 120 * 190 * 80;

            stellplazt.lagerplatz = this.genLagerPlatz(i, y, e4);

            stellplazt.static = true;
            stellplazt.prufziffern = 0;
            stellplazt.lagerid = 0;
            stellplazt.lagerName = 'lager';
            this.StellPlatze.push(stellplazt);
          } else if ((e4 == 1 && y <= 56) || (e4 == 2 && y <= 56)) {
            const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();

            //lxhxb
            stellplazt.lagerPlatzVolumen = 120 * 170 * 80;

            stellplazt.lagerplatz = this.genLagerPlatz(i, y, e4);

            stellplazt.static = false;
            stellplazt.prufziffern = 0;
            stellplazt.lagerid = 0;
            stellplazt.lagerName = 'lager';
            this.StellPlatze.push(stellplazt);
          } else {
            const stellplazt: LagerPlatztDTO = new LagerPlatztDTO();

            //lxhxb
            stellplazt.lagerPlatzVolumen = 120 * 220 * 80;

            stellplazt.lagerplatz = this.genLagerPlatz(i, y, e4);

            stellplazt.static = false;
            stellplazt.prufziffern = 0;
            stellplazt.lagerid = 0;
            stellplazt.lagerName = 'lager';
            this.StellPlatze.push(stellplazt);
          }
        }
      }
    }
    console.log('stellplatze ' + this.StellPlatze.length);
    return this.StellPlatze;
  }
  private genLagerPlatz(i: number, y: number, e: number): string {
    if (i < 10 && y < 10) {
      return '0' + i + '-' + '0' + y + '-' + '01-' + '0' + e;
    }
    if (i >= 10 && y < 10) {
      return '' + i + '-' + '0' + y + '-' + '01-' + '0' + e;
    }
    if (i < 10 && y >= 10) {
      return '0' + i + '-' + y + '-' + '01-' + '0' + e;
    }
    if (i >= 10 && y >= 10) {
      return '' + i + '-' + y + '-' + '01-' + '0' + e;
    }
  }
}
