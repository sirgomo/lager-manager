import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { DispositorEntity } from 'src/entity/dispositorEntity'
import { Not, Repository } from 'typeorm';

@Injectable()
export class WarenKontrolleService {
  constructor(
    @InjectRepository(InKomissPalletenEntity)
    private palRepo: Repository<InKomissPalletenEntity>,
    @InjectRepository(KommisioDetailsEntity)
    private komDetailsRepo: Repository<KommisioDetailsEntity>,
    @InjectRepository(KommissionirungEntity)
    private komRepo: Repository<KommissionirungEntity>,
  ) {}

  async getAllKommisionierungen(): Promise<KommissionirungEntity[]> {
    try {
      return await this.komRepo
        .query(
          `SELECT id, verkauferId, verk,maxPalettenHoher,gewunschtesLieferDatum,
      dispositorId,kommissStatus,spedition,versorgungId FROM kommissionierung 
      LEFT JOIN(SELECT id as uid, CONCAT(vorname,'.',nachname) as verk FROM users )  as u ON u.uid = verkauferId
      WHERE kommissStatus != 'INBEARBEITUNG' OR 'FERTIG' ORDER BY gewunschtesLieferDatum ASC`,
        )
        .then(
          (data) => {
            return data;
          },
          (err) => {
            console.log(err);
            throw new HttpException(
              'Etwas ist schieff gelaufen als ich kommissionierungen krigen wollte',
              HttpStatus.NOT_FOUND,
            );
          },
        );
    } catch (err) {
      return err;
    }
  }
  async getKommById(id: number) {
    try {
      return await this.komDetailsRepo
        .query(
          `
      SELECT id, kommdetails.artikelId as aid,kommissId, menge, currentGepackt, kreditorId, gepackt,palettennr, artikel.name, SUM(kommdetails.menge * artikel.gewicht / artikel.minLosMenge) as gewicht, artikel.artikelFlage as ARTIKELFLAGE
      FROM kommdetails LEFT JOIN artikel ON artikel.artikelId=kommdetails.artikelId AND artikel.liferantId=kommdetails.kreditorId 
      WHERE inBestellung=0 AND kommissId=${id} GROUP BY kommdetails.id `,
        )
        .catch((err) => {
          console.log(err);
          throw new HttpException(
            'ich kann die Komm Details nicht finden !',
            HttpStatus.NOT_FOUND,
          );
        });
    } catch (err) {
      return err;
    }
  }
  async getPaletenByKomissId(id: number) {
    try {
      return await this.palRepo
        .createQueryBuilder('t')
        .select([
          'autoid',
          'id',
          'palettenTyp',
          'lkwNummer',
          'kontrolliert',
          'paletteRealGewicht',
        ])
        //TODO change it to null and not deafult 0
        .where('artikelId = 0')
        .andWhere('kommId = :id', { id: id })
        .getRawMany()
        .then(
          (data) => {
            if (data.length === 0 || data === null) {
              throw new HttpException(
                'Keine Paleten gefunden!',
                HttpStatus.NOT_FOUND,
              );
            }
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
  async getKommissionier(palid: number) {
    try {
      return await this.komDetailsRepo
        .query(
          `
      SELECT inkomisspal.id as iid, userId, users.vorname, users.nachname FROM inkomisspal
      LEFT JOIN users ON users.id=userId WHERE inkomisspal.id=${palid} LIMIT 1
      `,
        )
        .catch((err) => {
          console.log(err);
          throw new HttpException(
            'Ich kann Kommissionier nicht finden',
            HttpStatus.NOT_FOUND,
          );
        });
    } catch (err) {
      return err;
    }
  }
  async setNewStatus(kommid: number, status: any) {
    try {
      return await this.komRepo
        .findOne({ where: { id: kommid } })
        .then((data) => {
          data.kommissStatus = status.KOMMISIONSTATUS;
          return this.komRepo.update({ id: kommid }, data).then(
            () => {
              return 1;
            },
            () => {
              throw new HttpException(
                'Etwas ist schiefgegangen, ich konnte Kommisionierung status nicht ändern',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            },
          );
        });
    } catch (err) {
      return err;
    }
  }
  async getPaleteByIdForControle(palnr: number) {
    try {
      return this.palRepo
        .createQueryBuilder('pal')
        .select(
          'pal.autoid, pal.id, pal.artikelId, pal.artikelMenge,pal.liferantId, pal.kontrolliert',
        )
        .leftJoin(
          ArtikelEntity,
          'art',
          'art.artikelId=pal.artikelId AND art.liferantId=pal.liferantId',
        )
        .addSelect('art.name', 'name')
        .where('pal.id = :id', { id: palnr })
        .andWhere('pal.artikelId != 0')
        .getRawMany()
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
  async getPaleteToDruck(palnr: number, kommid: number) { 
    try {
      const gewicht = await (await this.palRepo.findOne({where: {id: palnr, artikelId: 0}})).paletteRealGewicht;
      return await this.palRepo
        .createQueryBuilder('pal')
        .select(
          'pal.artikelId, pal.artikelMenge, pal.liferantId,pal.kommId, pal.lkwNummer, pal.paletteRealGewicht',
        )
        .leftJoin(
          ArtikelEntity,
          'art',
          'art.artikelId=pal.artikelId AND art.liferantId=pal.liferantId',
        )
        .addSelect('art.name', 'name')
        .leftJoin(KommissionirungEntity, 'kom', 'kom.id=' + kommid)
        .addSelect('kom.dispositorId, kom.gewunschtesLieferDatum, kom.versorgungId')
        .leftJoin(DispositorEntity, 'dispo', 'dispo.id=kom.dispositorId')
        .addSelect('dispo.name')
        .where('pal.id = :id', { id: palnr })
        .andWhere('pal.artikelId != 0')
        .getRawMany()
        .then(
          (data) => {
          
            for( let i = 0; i < data.length; i++) {
              data[i].paletteRealGewicht = gewicht;
            }
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
  async getPalettenToDruck(kommid: number) {
    try {
      const gewicht = await (await this.palRepo.findOne({where: {kommId: kommid, artikelId: 0}})).paletteRealGewicht;
      return this.komDetailsRepo.createQueryBuilder('det')
      .select('det.id, det.kommissId')
      .leftJoin(InKomissPalletenEntity, 'pal', 'pal.kommId=det.id AND pal.artikelId != 0')
      .addSelect('pal.artikelId, pal.artikelMenge, pal.liferantId,pal.id, pal.lkwNummer, pal.paletteRealGewicht')
      .leftJoin(
        ArtikelEntity,
        'art',
        'art.artikelId=pal.artikelId AND art.liferantId=pal.liferantId',
      )
      .addSelect('art.name', 'name')
      .leftJoin(KommissionirungEntity, 'kom', 'kom.id=' + kommid)
      .addSelect('kom.dispositorId, kom.gewunschtesLieferDatum, kom.versorgungId')
      .leftJoin(DispositorEntity, 'dispo', 'dispo.id=kom.dispositorId')
      .addSelect('dispo.name')
      .where('det.kommissId = :id', { id: kommid })
      .getRawMany()
      .then(
        (data) => {
          for( let i = 0; i < data.length; i++) {
            data[i].paletteRealGewicht = gewicht;
          }
         
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
  async setWareControled(artid: number) {
  
    try {
      const tmpEn: InKomissPalletenEntity = await this.palRepo.findOneBy({autoid: artid});
      if(tmpEn === null) {
        throw new HttpException('Etwas ist schiefgegangen, artikel nicht gefunden', HttpStatus.NOT_FOUND);
      }
     
      if(tmpEn.kontrolliert === false) {
        tmpEn.kontrolliert = true;
      }else {
        tmpEn.kontrolliert = false;
      }
      const update: number = await (await this.palRepo.update({'autoid': artid}, tmpEn)).affected;
     
      const palKontrolFertig: number = await (await (await this.palRepo.find({where: {id: tmpEn.id, artikelId : Not(0), kontrolliert: false}})).length);
      const palWithArtNull: InKomissPalletenEntity = await  this.palRepo.findOne({where: {id: tmpEn.id, artikelId: 0}});
      if (palKontrolFertig !== 0 && palWithArtNull.kontrolliert === true) {
        palWithArtNull.kontrolliert = false;
        await this.palRepo.update({'autoid': palWithArtNull.autoid}, palWithArtNull);
      } else if (palKontrolFertig === 0) {
        palWithArtNull.kontrolliert = true;
        await this.palRepo.update({'autoid': palWithArtNull.autoid}, palWithArtNull);
      }
      return update;
    } catch (err) {
      return err;
    }
  }
 async setLkwNr(palnr: number, lkwnr: number) { 
    try {
      const tympPal: InKomissPalletenEntity = await this.palRepo.findOne({where: {autoid: palnr}});
        if(tympPal === null) {
          throw new HttpException('Keine palette gefunden!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      tympPal.lkwNummer = lkwnr;
      await this.palRepo.createQueryBuilder('pal')
      .update('inkomisspal', {'lkwNummer': lkwnr})
     
      .where('id= :id', {id: tympPal.id})
      .execute().then( (data) => {
      }, (err) => {
        console.log(err);
      });
      
      return await (await this.palRepo.update({'autoid': palnr}, tympPal)).affected;
    } catch (err) {
      return err;
    }
  }
}
