import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InKomissPalletenEntity } from 'src/entity/InKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Repository } from 'typeorm';

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
      SELECT id, kommDetails.artikelId as aid,kommissId, menge, currentGepackt, kreditorId, gepackt,palettennr, artikel.name, SUM(kommDetails.menge * artikel.gewicht / artikel.minLosMenge) as gewicht, artikel.artikelFlage as ARTIKELFLAGE
      FROM kommDetails LEFT JOIN artikel ON artikel.artikelId=kommDetails.artikelId AND artikel.liferantId=kommDetails.kreditorId 
      WHERE inBestellung=0 AND kommissId=${id} GROUP BY kommDetails.id `,
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
    console.log('palid ' + palid);
    try {
      return await this.komDetailsRepo
        .query(
          `
      SELECT inKomissPal.id as iid, userId, users.vorname, users.nachname FROM inKomissPal
      LEFT JOIN users ON users.id=userId WHERE inKomissPal.id=${palid} LIMIT 1
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
}
