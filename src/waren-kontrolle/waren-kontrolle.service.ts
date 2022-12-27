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
      dispositorId,kommissStatus,spedition,versorungId FROM kommissionierung 
      LEFT JOIN(SELECT id as uid, CONCAT(vorname,'.',nachname) as verk FROM users )  as u ON u.uid = verkauferId
      WHERE kommissStatus != 'INBEARBEITUNG' OR 'FERTIG'`,
        )
        .then(
          (data) => {
            return data;
          },
          () => {
            throw new HttpException(
              'Etwas ist schieff gelaufen als ich kommissionierungen krigen wollte',
              HttpStatus.NOT_FOUND,
            );
          },
        );
    } catch (err) {
      return err;
    }
    /*  return await this.komRepo
      .find({
        where: {
          kommissStatus:
            Not(KOMMISIONSTATUS.INBEARBEITUNG) || Not(KOMMISIONSTATUS.FERTIG),
        },
      })
      .then((data) => {
        return data;
      });*/
  }
}
