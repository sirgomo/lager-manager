import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeditionDTO } from 'src/DTO/speditionDTO';
import { SpeditionEntity } from 'src/entity/speditionEntity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeditionService {
  constructor(
    @InjectRepository(SpeditionEntity)
    private repo: Repository<SpeditionEntity>,
  ) {}

  async getAllSpditors(): Promise<SpeditionEntity[]> {
    try {
      return await this.repo.find().then((data) => {
        if (
          data.length === null ||
          data.length === undefined ||
          data.length === 0
        ) {
          this.repo.query(
            `insert INTO spedition (name, name2, maxLadeGewicht, maxPalettenMenge, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('wir', null,'22500','33', 'nms', 'ajksdh 23', '24345', '11111112')`,
          );
          this.repo.query(
            `insert INTO spedition (name, name2, maxLadeGewicht, maxPalettenMenge, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('wir2', null,'23500','33', 'hamburg', 'ajksdh 23', '24345', '11111112')`,
          );
          this.repo.query(
            `insert INTO spedition (name, name2, maxLadeGewicht, maxPalettenMenge, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('cont', 'ocok','22500','23', 'hamburg', 'ajksdh 23', '24345', '11111112')`,
          );
          throw new HttpException(
            'Etwas ist schiefgelaufen, hab kein Speditors gefunden',
            HttpStatus.NOT_FOUND,
          );
        }
        return data;
      });
    } catch (err) {
      return err;
    }
  }
  async createSpeditor(speditor: SpeditionDTO): Promise<SpeditionEntity> {
    await this.repo.create(speditor);
    try {
      return await this.repo.save(speditor).catch(() => {
        throw new HttpException(
          'Etwas ist schiefgelaufen, Der Speditor wurde nicht entstanden',
          HttpStatus.NOT_FOUND,
        );
      });
    } catch (err) {
      return err;
    }
  }
  async updateSpeditor(speditor: SpeditionDTO, id: number) {
    try {
      await this.repo.update(id, speditor);
      return await this.repo.findOneBy({ id: speditor.id }).catch(() => {
        throw new HttpException(
          'Etwas ist schiefgelaufen, Der Speditor wurde nicht entstanden',
          HttpStatus.NOT_FOUND,
        );
      });
    } catch (err) {
      return err;
    }
  }
  async deleteSpeditor(id: number) {
    try {
      const tmpDel: number = await (await this.repo.delete(id)).affected;
      if (tmpDel !== 1) {
        throw new HttpException(
          'Etwas ist schiefgelaufen, Der Speditor wurde nicht gelöscht',
          HttpStatus.NOT_FOUND,
        );
      }
      return tmpDel;
    } catch (err) {
      return err;
    }
  }
}
