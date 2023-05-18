import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { ArtikelDTO } from 'src/DTO/artikelDTO';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { LagerPlatzEntity, PALETTENTYP } from 'src/entity/lagerPlatzEntity';
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
      //const lagerPlatz: LagerPlatztDTO[] = [];

      if (!this.helper.generateLager && !this.helper.fullLageraus) {
        return await this.repo
          .query(
            `SELECT lagerplatz.*, artikel.name, dispositor.name as lifer FROM lagerplatz LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId
            LEFT JOIN dispositor ON lagerplatz.liferant = dispositor.id ORDER BY ISNULL(artId) ASC`,
          )
          .then((data) => {
            return data;
          });
      }
      //return lagerPlatz;
    } catch (err) {
      throw new Error(
        'problem mit lager service, lagerservice kann nicht lagerplatz machen',
      );
    }
  }
  async getPlatzById(lagerplatzid: number) {
    try {
      return await this.repo
        .query(
          `SELECT lagerplatz.*, artikel.name, dispositor.name as lifer FROM lagerplatz LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId
            LEFT JOIN dispositor ON lagerplatz.liferant = dispositor.id WHERE lagerplatz.id=` +
            lagerplatzid,
        )
        .then(
          (data) => {
            return data;
          },
          (err) => {
            console.log(err);
          },
        );
    } catch (err) {
      return err;
    }
  }
  async createLagerPlatz(
    lagerplatz: LagerPlatztDTO,
  ): Promise<LagerPlatzEntity> {
    try {
      lagerplatz.mhd = this.formatDate(lagerplatz.mhd);

      /* if (lagerplatz.artId !== null && isFinite(lagerplatz.artId)) {
        let tmpArt: ArtikelDTO = new ArtikelDTO();
        tmpArt = await this.artServ.getArtikelFurLager(lagerplatz.artId);
        lagerplatz.einheit = tmpArt.basisEinheit;
        lagerplatz.liferant = tmpArt.liferantId;
        
      }*/
      if (lagerplatz.palettenTyp === PALETTENTYP.KEINPALETTE) {
        lagerplatz.palettenTyp = PALETTENTYP.EU;
      }
      if (lagerplatz.id !== undefined && lagerplatz.id !== null) {
        return;
      }

      await this.repo.create(lagerplatz);
      return await this.repo.save(lagerplatz).then(
        (data) => {
          console.log(data);
          return data;
        },
        (err) => {
          console.log(err);
          return err;
        },
      );
    } catch (err) {
      return err;
    }
  }
  async patchLagerplatz(lagerplatz: LagerPlatztDTO) {
    if (lagerplatz.id === undefined) {
      return;
    }
    try {
      if (lagerplatz.mhd !== undefined && lagerplatz.mhd !== null)
        lagerplatz.mhd = this.formatDate(lagerplatz.mhd);

      await this.repo.findOne({ where: { id: lagerplatz.id } }).then((res) => {
        if (res === null) {
          throw new HttpException(
            'Lagerplatz nicht gefunden!',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (
          res.prufziffern !== lagerplatz.prufziffern ||
          res.id !== lagerplatz.id
        ) {
          throw new HttpException(
            'Pruffcifern stimmt nicht!',
            HttpStatus.BAD_REQUEST,
          );
        }
        if (res.artId !== null && res.artikelMenge !== null) {
          if (
            res.mhd !== null &&
            lagerplatz.mhd !== null &&
            new Date(res.mhd).getTime() < new Date(lagerplatz.mhd).getTime()
          ) {
            throw new HttpException(
              'Mhd ist andre als das alte, stelle neue lagerplatz ein!',
              HttpStatus.CONFLICT,
            );
          }
          lagerplatz.artikelMenge += res.artikelMenge;
        }
      });
      lagerplatz = this.repo.create(lagerplatz);
      console.log(lagerplatz);
      return await this.repo.update({ id: lagerplatz.id }, lagerplatz).then(
        (dat) => {
          return dat;
        },
        (err) => {
          console.log(err);
        },
      );
    } catch (err) {
      return err;
    }
  }
  formatDate(date: Date): Date {
    if (date === undefined) return null;
    try {
      return new Date(new Date(date).toDateString());
    } catch (err) {}

    return null;
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
       LEFT JOIN (SELECT artikelId as a_id, SUM(menge) AS resMenge FROM kommdetails group by a_id) artreservation ON lagerplatz.artId = a_id 
        WHERE lagerplatz.artId IS NOT NULL group by lagerplatz.artId, fehlArtikelMenge, resMenge, artikel.name, artikel.verPrice, artikel.minLosMenge, artikel.gewicht, artikel.basisEinheit, artikel.ARTIKELFLAGE, artikel.liferantId  `,
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
        LEFT JOIN (SELECT artikelId as a_id, SUM(menge) AS resMenge FROM kommdetails group by a_id) artreservation ON lagerplatz.artId = a_id 
        WHERE lagerplatz.artId = '${artid}' group by lagerplatz.artId, fehlArtikelMenge, resMenge, artikel.name, artikel.verPrice, artikel.minLosMenge, artikel.gewicht, artikel.basisEinheit, artikel.ARTIKELFLAGE, artikel.liferantId 
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
  async getPlattzeMitArtikel(artnr: number, liferne: number) {
    console.log(artnr + ' lifer ' + liferne);
    try {
      if (artnr === undefined || artnr === null) {
        return;
      }
      return this.repo
        .createQueryBuilder('lag')
        .select(
          'lag.lagerplatz, lag.artikelMenge, lag.palettenTyp, lag.mhd, art.name',
        )
        .leftJoin(
          ArtikelEntity,
          'art',
          'art.artikelId=' + artnr + ' AND art.liferantId=' + liferne,
        )
        .addSelect('art.name')
        .where('lag.artId =' + artnr + ' AND lag.liferant=' + liferne)
        .orderBy('lag.mhd')
        .getRawMany()
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      return err;
    }
  }
  async getCountOfPlatze() {
    try {
      {
        return await this.repo
          .createQueryBuilder('lag')
          .select('LEFT(lag.lagerplatz, 2)+0', 'gang')
          .addSelect('COUNT(lag.artId)', 'bezetz')
          .addSelect('COUNT(lag.lagerplatz)', 'total')
          .leftJoin(
            LagerPlatzEntity,
            'lag2',
            'lag.id=lag2.id AND lag2.static=1 AND lag2.artId IS NULL',
          )
          .addSelect('COUNT(lag2.static)', 'freestatic')
          .groupBy('LEFT(lag.lagerplatz, 2)+0')
          .getRawMany()
          .then(
            (data) => {
              return data;
            },
            (err) => {
              console.log(err);
              throw new HttpException(
                'Ich kann die Platze nicht zehlen!',
                HttpStatus.BAD_REQUEST,
              );
            },
          );
      }
    } catch (err) {
      return err;
    }
  }
  async getPlattzeImGangs(nr: number): Promise<any[]> {
    try {
      return await this.repo
        .createQueryBuilder('lag')
        .select('id,lagerplatz, static, prufziffern')
        .where('LEFT(lag.lagerplatz,2) +0 = :nr', { nr: nr })
        .andWhere('lag.artId IS NULL')
        .orderBy('lag.lagerplatz')
        .getRawMany()
        .then(
          (data) => {
            return data;
          },
          (err) => {
            console.log(err);
            throw new HttpException(
              'Keine freie Stellplatze gefunden',
              HttpStatus.BAD_REQUEST,
            );
          },
        );
    } catch (err) {
      return err;
    }
  }
  async getStaticPlatzeMitWare(id: number, liferantId: number): Promise<any[]> {
    if (id === undefined || id === null) {
      return;
    }
    try {
      return await this.repo
        .createQueryBuilder('lag')
        .select('id,lagerplatz,artikelMenge,prufziffern, mhd')
        .where(
          'lag.artId =' +
            id +
            ' AND lag.liferant=' +
            liferantId +
            ' AND lag.static = 1',
        )
        .getRawMany()
        .catch((err) => {
          console.log(err);
          throw new HttpException(
            'Keine Artikel gefunden',
            HttpStatus.NOT_FOUND,
          );
        });
    } catch (err) {
      return err;
    }
  }
  async getPlattzOnBarScan(barcode: string): Promise<any> {
    try {
      /*return await this.repo
        .createQueryBuilder('lag')
        .select('id,lagerplatz, static, prufziffern')
        .where('lag.barcode= :bar', { bar: barcode })
        .andWhere('lag.artikelMenge=0 OR lag.artikelMenge IS NULL')
        .getRawMany()*/
      return this.repo
        .findOne({
          select: {
            id: true,
            lagerplatz: true,
            static: true,
            prufziffern: true,
          },
          where: { barcode: barcode },
        })
        .then(
          (data) => {
            if (data === null) {
              throw new HttpException(
                'Keien Stellplatz gefunden',
                HttpStatus.NOT_FOUND,
              );
            }
            return data;
          },
          (err) => {
            console.log(err);
            throw new HttpException(
              'Keine freie Stellplatze gefunden oder der platz ist bezetz',
              HttpStatus.BAD_REQUEST,
            );
          },
        );
    } catch (err) {
      return err;
    }
  }
}
