import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddArtikelKommissDTO } from 'src/DTO/addArtikelKommissDTO';
import { ArtikelKommissDTO } from 'src/DTO/artikelKommissDTO';
import { ArtikelSchiebenDTO } from 'src/DTO/artikelSchiebenDTO';
import { KomissDTO } from 'src/DTO/komissDTO';
import { PalettenMengeVorausDTO } from 'src/DTO/palettenMengeVorausDTO';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import {
  ARTIKELSTATUS,
  KommisioDetailsEntity,
} from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { Helper } from 'src/helper';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class VerkaufService {
  private helper: Helper = new Helper();
  constructor(
    @InjectRepository(KommissionirungEntity)
    private repo: Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity)
    private repoDetails: Repository<KommisioDetailsEntity>,
    private repoLager: LagerService,
  ) {}
  async getAllKommiss() {
    try {
      return await this.repo.find({
        select: {
          id: true,
          verkauferId: true,
          maxPalettenHoher: true,
          gewunschtesLieferDatum: true,
          dispositorId: true,
          spedition: true,
          versorgungId: true,
          kommissStatus: true,
        },
      });
    } catch (err) {
      throw new Error(
        'Etwas ist schif gelaufen in Komiss Service on getall ' + err,
      );
    }
  }
  async getAllKommisByVerkaufer(verkaufer: number) {
    try {
      return await this.repo.find({
        select: {
          id: true,
          verkauferId: true,
          maxPalettenHoher: true,
          gewunschtesLieferDatum: true,
          dispositorId: true,
          spedition: true,
          versorgungId: true,
          kommissStatus: true,
        },
        where: {
          verkauferId: verkaufer,
        },
      });
    } catch (err) {
      throw new Error(
        'Etwas ist schif gelaufen in Komiss Service on getall by verkaufer ' +
          err,
      );
    }
  }
  async createKommiss(komm: KomissDTO) {
    //check if object entery is date and remove hours
    for (const [key, value] of Object.entries(komm)) {
      try {
        const tmp = String(value).split('-');
        if (tmp.length > 2) {
          komm[key] = this.formatDate(value);
        }
      } catch (err) {}
    }
    try {
      await this.repo.create(komm);
      return await this.repo.save(komm);
    } catch (err) {
      throw new Error(
        'Etwas ist schiff gelaufen in Kommiss Service on createKomm ' + err,
      );
    }
  }
  async updateKommiss(komm: KomissDTO) {
    //check if object entery is date and remove hours
    for (const [key, value] of Object.entries(komm)) {
      try {
        const tmp = String(value).split('-');
        if (tmp.length > 2) {
          komm[key] = this.formatDate(value);
        }
      } catch (err) {}
    }
    try {
      await this.repo.create(komm);
      return await this.repo.findOne({ where: { id: komm.id } }).then(
        (data) => {
          for (const [key, value] of Object.entries(data)) {
            for (const [key1, value1] of Object.entries(komm)) {
              if (key === key1 && value !== value1) {
                if (Array.isArray(data[key])) break;
                data[key] = value1;
              }
            }
          }
          return this.repo.update(
            { id: komm.id, verkauferId: komm.verkauferId },
            data,
          );
        },
        (err) => {
          console.log(err);
        },
      );
    } catch (err) {
      throw new Error(
        'Etwas ist schiff gelaufen als ich wollte kommissionierung updaten',
      );
    }
  }
  formatDate(date: Date): Date {
    return new Date(new Date(date).toDateString());
  }
  async addArtikelToKommiss(art: AddArtikelKommissDTO[]) {
    const kommArr: KommissionirungEntity[] = [];
    for (let i = 0; i !== art.length; i++) {
      const tmp: KommisioDetailsEntity = new KommisioDetailsEntity();
      try {
        if (art[i].artMenge === 0) {
          throw new Error('Artikel mange darf nicht 0 sein');
        }
        if (!art[i].inBestellung) {
          art[i].inBestellung = false;
        }
        const komm: KommissionirungEntity = await this.repo.findOne({
          where: { id: art[i].kommNr },
          relations: { kommDetails: true },
        });
        //wollen wir das das zwiete mall das selber artikel als neue position oder einfach als beide sumiert ? hiere getrent positions
        /*await this.repoDetails.findOneBy({'artikelId':art.artikelId, 'kommissId':art.kommNr}).then(data=>{
        if(data !== null){
          Object.assign(tmp, data);
        }
      });*/

        //haben wir genug davon ?
        let artToCheck: ArtikelKommissDTO = new ArtikelKommissDTO();
        await this.repoLager
          .getCurrentArtiMenge(art[i].artikelId)
          .then((data) => {
            artToCheck = data;
          });
        if (artToCheck !== null) {
          if (artToCheck.total < art[i].artMenge && !art[i].inBestellung) {
            throw new Error('Nicht genug Artikel !!');
          }
        }
        tmp.inBestellung = art[i].inBestellung;
        tmp.logisticBelegNr = art[i].logisticBelegNr;
        if (komm !== undefined && komm.id !== undefined) {
          tmp.artikelId = art[i].artikelId;
          tmp.menge = art[i].artMenge;
          tmp.kommissId = komm.id;
          tmp.gepackt = ARTIKELSTATUS.INPACKEN;
          tmp.kreditorId = art[i].kreditorId;
          tmp.rabatt = art[i].rabatt;

          if (
            art[i].kommDeatailnr !== null &&
            art[i].kommDeatailnr !== undefined
          ) {
            tmp.id = art[i].kommDeatailnr;
          }
        }
        if (tmp.kommissId !== undefined && tmp.kommissId === art[i].kommNr) {
          await this.repoDetails.create(tmp);
          if (komm.kommDetails.length > 0) {
            let found = false;
            komm.kommDetails.forEach((data) => {
              if (data !== null && data.id === art[i].kommDeatailnr) {
                data.menge = tmp.menge;
                found = true;
              }
            });
            if (!found) {
              komm.kommDetails.push(tmp);
            }
          } else {
            komm.kommDetails = [tmp];
          }

          kommArr[i] = await this.repo.save(komm).then((data) => {
            return data;
          });
        }
      } catch (err) {
        throw new Error(
          'Etwas ist schiff gelaufen in Kommiss Service on add Artikel ' + err,
        );
      }
    }
    return kommArr;
  }

  async getArtikels() {
    const art: ArtikelKommissDTO[] = [];
    try {
      await this.repoLager.getArtiklesForKommiss().then((data) => {
        if (data.length === undefined || data === null) return art;
        for (let i = 0; i !== data.length; i++) {
          const tmp: ArtikelKommissDTO = new ArtikelKommissDTO();
          Object.assign(tmp, data[i]);
          art.push(tmp);
        }
      });
      return art;
    } catch (err) {
      return err;
    }
  }
  async getCurrentArtikelMenge(artid: number) {
    try {
      return await this.repoLager.getCurrentArtiMenge(artid).then((data) => {
        const tmp: ArtikelKommissDTO = new ArtikelKommissDTO();
        Object.assign(tmp, data);
        return tmp;
      });
    } catch (err) {
      throw new Error(
        'Etwas isst schiff in get Currrent menge  for 1 art ' + err,
      );
    }
  }
  async deleteKomm(id: number) {
    try {
      return await (
        await this.repo.delete({ id: id })
      ).affected;
    } catch (err) {
      throw new Error(
        'Etwas ist schieff gelaufen, ich konnte die komm nicht löschen ' + err,
      );
    }
  }
  async deleteArtikelFromKomm(id: number) {
    let tmp: KommisioDetailsEntity = new KommisioDetailsEntity();
    try {
      await this.repoDetails.findOne({ where: { id: id } }).then((data) => {
        if (data != null) {
          tmp = data;
        }
      });

      if (tmp.id == null) {
        return;
      }
      return await this.repoDetails.delete({ id: id }).then(
        (data) => {
          return data.affected;
        },
        (err) => {
          console.log('blad ' + err);
        },
      );
    } catch (err) {
      throw new Error(
        'Etwas ist schieff gegangen als ich wollete position in komm löschen ' +
          err,
      );
    }
  }
  async getVorausgesehenPaletenMenge(komissId: number) {
    const artikels: PalettenMengeVorausDTO[] = [];
    let komm: KommissionirungEntity = new KommissionirungEntity();
    komm = await this.repo.findOneBy({ id: komissId });

    return await this.repoDetails
      .query(
        `SELECT kommDetails.artikelId, menge, gepackt, statlagerplatz,proPalete, paleteTyp,artikel.artikelId, artikel.name, artikel.minLosMenge,
      artikel.grosse, artikel.gewicht, artikel.basisEinheit, artikel.artikelFlage FROM kommDetails 
      LEFT JOIN artikel ON artikel.artikelId = kommDetails.artikelId
      LEFT JOIN (SELECT artId, lagerplatz AS statlagerplatz, mengeProPalete AS proPalete, palettenTyp AS paleteTyp FROM lagerplatz WHERE static = true ) lagerplatz ON lagerplatz.artId = kommDetails.artikelId
      WHERE kommissId = '${komissId}' AND inBestellung = false ORDER BY statlagerplatz ASC`,
      )
      .then((data) => {
        if (artikels.length > 0) {
          artikels.splice(0, artikels.length);
        }
        for (let i = 0; i !== data.length; i++) {
          const art: PalettenMengeVorausDTO = new PalettenMengeVorausDTO();
          Object.assign(art, data[i]);
          artikels.push(art);
        }
        if (komm.maxPalettenHoher !== null) {
          this.helper.getTotalPalettenMenge(
            komm.maxPalettenHoher,
            artikels,
            komissId,
          );
          return artikels;
        }
      });
  }
  async changeKommStatus(kommId: number, status: any) {
    try {
      return await this.repo.findOne({ where: { id: kommId } }).then((data) => {
        if (
          data === undefined ||
          data === null ||
          status.kommissStatus === undefined
        ) {
          throw new HttpException(
            'Kommissionierung nicht gefunden',
            HttpStatus.BAD_REQUEST,
          );
        }
        data.kommissStatus = status.kommissStatus;
        return this.repo.save(data);
      });
    } catch (err) {
      return err;
    }
  }
  getKommById(kommId: number): Promise<KommissionirungEntity> {
    try {
      return this.repo.findOne({
        where: { id: kommId },
        relations: {
          kommDetails: true,
        },
      });
    } catch (err) {
      return err;
    }
  }
  async getKommissWithArtikel(artid: number, liferant: number) {
    try {
      return await this.repoDetails
        .createQueryBuilder('deta')
        .select([
          'deta.id, deta.kommissId, deta.menge, deta.gepackt, kom.gewunschtesLieferDatum, art.name',
        ])
        .leftJoin(
          KommissionirungEntity,
          'kom',
          'deta.kommissId = kom.id AND kom.kommissStatus!="FERTIG"',
        )
        .addSelect('kom.gewunschtesLieferDatum')
        .leftJoin(
          ArtikelEntity,
          'art',
          'art.artikelId = :aid AND art.liferantId = :lid',
          { aid: artid, lid: liferant },
        )
        .addSelect('art.name')
        .where('deta.artikelId = :artid AND deta.kreditorId = :lid', {
          artid: artid,
          lid: liferant,
        })
        .andWhere('deta.inBestellung=0')
        .andWhere('kom.gewunschtesLieferDatum IS NOT NULL')
        .orderBy('kom.gewunschtesLieferDatum', 'DESC')
        .getRawMany()
        .then(
          (data) => {
            //  console.log(data.length);
            type tmparts = {
              id: number;
              name: string;
              kommissId: number;
              menge: number;
              gepackt: string;
              gewunschtesLieferDatum: Date;
            };
            const tmp: tmparts[] = [];
            for (let i = 0; i < data.length; i++) {
              const ar: tmparts = {
                id: data[i].id,
                name: data[i].name,
                gepackt: data[i].gepackt,
                gewunschtesLieferDatum: data[i].gewunschtesLieferDatum,
                kommissId: data[i].kommissId,
                menge: data[i].menge,
              };
              tmp.push(ar);
            }
            return tmp;
          },
          (err) => {
            console.log(err);
          },
        );
    } catch (err) {
      return err;
    }
  }
  async artkielSchieben(data: ArtikelSchiebenDTO) {
    try {
      const tmpDetailsEnt: KommisioDetailsEntity =
        await this.repoDetails.findOne({ where: { id: data.kommDetailsid } });
      if (tmpDetailsEnt.menge === data.menge) {
        tmpDetailsEnt.kommissId = data.kommid;
        await this.repoDetails.delete({ id: tmpDetailsEnt.id });
        tmpDetailsEnt.id = null;

        return this.repo
          .findOne({
            where: { id: data.kommid },
            relations: { kommDetails: true },
          })
          .then((d) => {
            d.kommDetails.push(tmpDetailsEnt);
            return this.repo.save(d);
          });
      } else if (tmpDetailsEnt.menge > data.menge) {
        tmpDetailsEnt.menge -= data.menge;
        await this.repoDetails.save(tmpDetailsEnt);
        tmpDetailsEnt.menge = data.menge;
        tmpDetailsEnt.kommissId = data.kommid;
        tmpDetailsEnt.id = null;
        return this.repo
          .findOne({
            where: { id: data.kommid },
            relations: { kommDetails: true },
          })
          .then((d) => {
            d.kommDetails.push(tmpDetailsEnt);
            return this.repo.save(d);
          });
      } else {
        throw new HttpException('Menge ist falsch', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      return err;
    }
  }
}
