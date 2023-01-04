import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { LagerPlatzEntity, PALETTENTYP } from 'src/entity/LagerPlatzEntity';
import { Helper } from 'src/helper';
import { LagerPlatzGenerator } from 'src/lagerPlatzGen';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class LagerService {
  lagerGen: LagerPlatzGenerator = new LagerPlatzGenerator();
  StellPlatze: LagerPlatztDTO[] = [];
  helper: Helper = new Helper();
  constructor(
    @InjectRepository(LagerPlatzEntity)
    private repo: Repository<LagerPlatzEntity>,
    private artServ: ArtService,
  ) {}

  private genereLagaPlatze() {
    this.StellPlatze = this.lagerGen.getRegals();
    this.StellPlatze.forEach((data) => {
      this.createLagerPlatz(data);
    });
  }
  private async lagerArtikels() {
    const artikels: ArtikelMengeDTO[] = [];

    const tmp = await this.artServ.getAllArticel();
    tmp.forEach((art) => {
      const a: ArtikelMengeDTO = new ArtikelMengeDTO();
      a.aid = art.aid;
      a.artikelId = art.artikelId;
      a.menge = art.bestand;
      a.palete = PALETTENTYP.EU;
      artikels.push(a);
    });
    for (let i = 0; i < artikels.length; i++) {
      await this.genPlatzFurArtikel(artikels[i]);
    }
  }
  async getStellpletze() {
    try {
      if (this.helper.generateLager) {
        await this.genereLagaPlatze();
      }
      if (this.helper.fullLageraus) {
        await this.lagerArtikels();
      }
      const lagerPlatz: LagerPlatztDTO[] = [];

      if (!this.helper.generateLager && !this.helper.fullLageraus) {
        await this.repo
          .query(
            `SELECT lagerplatz.*, artikel.name FROM lagerplatz LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId ORDER BY ISNULL(artId) ASC`,
          )
          .then((data) => {
            data.forEach((element) => {
              const tmp: LagerPlatztDTO = new LagerPlatztDTO();
              Object.assign(tmp, element);
              lagerPlatz.push(tmp);
            });
          });
      }
      return lagerPlatz;
    } catch (err) {
      throw new Error(
        'problem mit lager service, lagerservice kann nicht lagerplatz machen',
      );
    }
  }
  async createLagerPlatz(
    lagerplatz: LagerPlatztDTO,
  ): Promise<LagerPlatzEntity> {
    try {
      if (lagerplatz.artId !== null && isFinite(lagerplatz.artId)) {
        let tmpArt: ArtikelDTO = new ArtikelDTO();
        tmpArt = await this.artServ.getArtikelFurLager(lagerplatz.artId);
        lagerplatz.einheit = tmpArt.basisEinheit;
        lagerplatz.liferant = tmpArt.liferantId;
        if (lagerplatz.palettenTyp === PALETTENTYP.KEINPALETTE) {
          lagerplatz.palettenTyp = PALETTENTYP.EU;
        }
      }
      await this.repo.create(lagerplatz);
      return await this.repo.save(lagerplatz).then(
        (data) => {
          return (lagerplatz = data);
        },
        (err) => {
          console.log(err);
          return err;
        },
      );
    } catch (err) {
      console.log(err);
      throw new Error(
        'problem mit lager service, lagerservice kann nicht lagerplatz erstellen',
      );
    }
  }
  async deleteLageplatzt(id: number) {
    try {
      await this.repo.findOneBy({ id: id }).then((data) => {
        if (data.artId !== null || data.artikelMenge !== null) {
          throw new Error('Der Lagerplatz ist besetzt !!');
        }
      });
      return await this.repo.delete({ id: id });
    } catch (err) {
      throw new Error('Etwas ist schief gegangen ' + err);
    }
  }

  async getPlatzFurArtikel(artMen: ArtikelMengeDTO) {
    try {
      //  let lagerPlatze : LagerPlatzEntity[] = new Array();
      let volMenge: number[][] = [];
      const artikel: ArtikelDTO = new ArtikelDTO();
      await this.artServ.getArtikel(artMen.aid).then((data) => {
        Object.assign(artikel, data);
      });
      if (isFinite(artikel.artikelId)) {
        volMenge = await this.helper.getPaletenVolumen(
          artikel.bestand,
          artikel.grosse,
          artikel.minLosMenge,
          205,
        );

        let neue = true;
        await this.repo.findOneBy({ artId: artikel.artikelId }).then(
          (data) => {
            if (data && data.artId !== null) neue = false;
          },
          (err) => {
            console.log(err);
          },
        );
        for (let i = 0; i < volMenge.length; i++) {
          if (neue) {
            //neue artikel es sollte erste position sein mit kleinste menge
            return await this.repo.findOne({
              select: {
                id: true,
                lagerplatz: true,
                artId: true,
                artikelMenge: true,
                lagerPlatzVolumen: true,
                static: true,
                palettenTyp: true,
              },
              where: {
                artId: IsNull(),
                lagerPlatzVolumen: MoreThanOrEqual(volMenge[i][0]),
                static: true,
              },
              order: { lagerPlatzVolumen: 'ASC' },
            }); //.then(data=>{
          } else {
            if (artMen.palete !== PALETTENTYP.KEINPALETTE) {
              return await this.repo.findOne({
                select: {
                  id: true,
                  lagerplatz: true,
                  artId: true,
                  artikelMenge: true,
                  lagerPlatzVolumen: true,
                  static: true,
                  palettenTyp: true,
                },
                where: {
                  artId: IsNull(),
                  lagerPlatzVolumen: MoreThanOrEqual(volMenge[i][0]),
                  static: false,
                },
                order: { lagerPlatzVolumen: 'ASC' },
              }); //.then(data=>{
            } else {
              let tmp: LagerPlatzEntity = new LagerPlatzEntity();

              tmp = await this.repo.findOneBy({
                artId: artMen.artikelId,
                static: true,
              });
              console.log(
                ' laczna objetosc ' +
                  this.helper.getVolumenNeueUndAlt(artikel, artMen) +
                  ' lagerplazt vol ' +
                  tmp.lagerPlatzVolumen,
              );
              if (
                (this.helper.getVolumenNeueUndAlt(artikel, artMen) <
                  tmp.lagerPlatzVolumen &&
                  artMen.mhd === undefined) ||
                (this.helper.getVolumenNeueUndAlt(artikel, artMen) <
                  tmp.lagerPlatzVolumen &&
                  artMen.mhd === tmp.mhd)
              ) {
                console.log(tmp);
                return tmp;
              } else {
                return await this.repo.findOne({
                  select: {
                    id: true,
                    lagerplatz: true,
                    artId: true,
                    artikelMenge: true,
                    lagerPlatzVolumen: true,
                    static: true,
                    palettenTyp: true,
                  },
                  where: {
                    artId: IsNull(),
                    lagerPlatzVolumen: MoreThanOrEqual(volMenge[i][0]),
                    static: true,
                  },
                  order: { lagerPlatzVolumen: 'ASC' },
                });
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error(' Cant find lagerplatz fur artikel ' + err);
    }
  }
  //generator
  async genPlatzFurArtikel(artMen: ArtikelMengeDTO) {
    let volMenge: number[][] = [];
    const artikel: ArtikelDTO = new ArtikelDTO();
    let cont = 0;
    await this.artServ.getArtikel(artMen.aid).then((data) => {
      Object.assign(artikel, data);
    });
    if (isFinite(artikel.aid)) {
      volMenge = await this.helper.getPaletenVolumen(
        artikel.bestand,
        artikel.grosse,
        artikel.minLosMenge,
        205,
      );

      //let neue: boolean = true;
      // await  this.repo.findOneBy({'artId':artikel.artikelId}).then(data=>{
      // if(data && data.artId !== null)  neue = false;

      //}, err=>{ console.log( err)});
      for (let i = 0; i < volMenge.length; i++) {
        try {
          //if(neue){
          if (i === 0) {
            const tmps = await this.repo.findOne({
              select: {
                id: true,
                lagerplatz: true,
                artId: true,
                artikelMenge: true,
                lagerPlatzVolumen: true,
                static: true,
              },
              where: {
                artId: IsNull(),
                lagerPlatzVolumen: MoreThanOrEqual(volMenge[i][0]),
                static: true,
              },
              order: { lagerPlatzVolumen: 'ASC' },
            }); //.then(data=>{
            tmps.artId = artikel.artikelId;
            tmps.artikelMenge = volMenge[i][1];
            tmps.mengeProPalete = volMenge[volMenge.length - 1][1];
            tmps.liferant = artikel.liferantId;
            tmps.mhd = this.helper.getRandomMhd();
            tmps.einheit = artikel.basisEinheit;
            tmps.palettenTyp = PALETTENTYP.EU;
            await this.repo.save(tmps);
            cont++;
          } else {
            if (artMen.palete !== PALETTENTYP.KEINPALETTE) {
              const tmps = await this.repo.findOne({
                select: {
                  id: true,
                  lagerplatz: true,
                  artId: true,
                  artikelMenge: true,
                  lagerPlatzVolumen: true,
                  static: true,
                },
                where: {
                  artId: IsNull(),
                  lagerPlatzVolumen: MoreThanOrEqual(volMenge[i][0]),
                  static: false,
                },
                order: { lagerPlatzVolumen: 'ASC' },
              }); //.then(data=>{
              tmps.artId = artikel.artikelId;
              tmps.artikelMenge = volMenge[i][1];
              tmps.mengeProPalete = volMenge[volMenge.length - 1][1];
              tmps.liferant = artikel.liferantId;
              tmps.mhd = this.helper.getRandomMhd();
              tmps.einheit = artikel.basisEinheit;
              tmps.palettenTyp = PALETTENTYP.EU;
              await this.repo.save(tmps);

              cont++;
            }
          }
        } catch (err) {
          console.log(err);
        }

        console.log(
          'volmenge ' +
            JSON.stringify(volMenge) +
            ' artikel ' +
            artikel.artikelId +
            ' cont ' +
            cont,
        );
        // await this.repo.create(lagerPlatze);
        // await this.repo.save(lagerPlatze);
        //await console.log(JSON.stringify(lagerPlatze));
      }
    }
  }
  //koniec generatora
  async getArtiklesForKommiss() {
    return await this.repo
      .query(
        `SELECT artId, SUM(artikelMenge) AS total, fehlArtikelId,fehlArtikelMenge, resMenge, 
       artikel.name, artikel.verPrice, artikel.minLosMenge, artikel.gewicht, artikel.basisEinheit, artikel.ARTIKELFLAGE, artikel.liferantId FROM lagerplatz
       LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId
       LEFT JOIN (SELECT artikelid AS fehlArtikelId, menge AS fehlArtikelMenge FROM artfehlend) artfehlend ON lagerplatz.artId = fehlArtikelId
       LEFT JOIN (SELECT artikelId as a_id, SUM(menge) AS resMenge FROM kommDetails group by a_id) artreservation ON lagerplatz.artId = a_id 
        WHERE lagerplatz.artId IS NOT NULL group by lagerplatz.artId `,
      )
      .then(
        (data) => {
          return data;
        },
        (err) => {
          console.log(err);
        },
      );
  }
  async getCurrentArtiMenge(artid: number) {
    return await this.repo
      .query(
        `SELECT artId, SUM(artikelMenge) AS total, fehlArtikelId, fehlArtikelMenge, resMenge, 
        artikel.name, artikel.verPrice, artikel.minLosMenge, artikel.gewicht, artikel.basisEinheit, artikel.ARTIKELFLAGE,artikel.liferantId FROM lagerplatz
        LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId
        LEFT JOIN (SELECT artikelid AS fehlArtikelId, menge AS fehlArtikelMenge FROM artfehlend) artfehlend ON lagerplatz.artId = fehlArtikelId
        LEFT JOIN (SELECT artikelId as a_id, SUM(menge) AS resMenge FROM kommDetails group by a_id) artreservation ON lagerplatz.artId = a_id 
        WHERE lagerplatz.artId = '${artid}' group by lagerplatz.artId 
        `,
      )
      .then(
        (data) => {
          // console.log(JSON.stringify(data))
          return data[0];
        },
        (err) => {
          console.log(err);
        },
      );
  }
}
