import { Injectable } from '@nestjs/common';
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
        (err) => {
          console.log(err);
        },
      );
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
