import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelAufPaletteDTO } from 'src/DTO/artikelAufPaletteDTO';
import { DataFurKomissDTO } from 'src/DTO/dataFurKomissDTO';
import { NeuePaletteDTO } from 'src/DTO/neuePaletteDTO';
import { InKomissPalletenEntity } from 'src/entity/InKomissPalletenEntity';
import {
  ARTIKELSTATUS,
  KommisioDetailsEntity,
} from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Helper } from 'src/helper';
import { Repository } from 'typeorm';

@Injectable()
export class KommissionierService {
  private helper: Helper = new Helper();
  constructor(
    @InjectRepository(KommissionirungEntity)
    private komm: Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity)
    private kommDet: Repository<KommisioDetailsEntity>,
    @InjectRepository(InKomissPalletenEntity)
    private pal: Repository<InKomissPalletenEntity>,
  ) {}

  async getKommissionierung(kommId: number): Promise<DataFurKomissDTO[]> {
    try {
      // lager platz, name, id, menge, komdetailid
      return await this.kommDet
        .query(
          `SELECT artikelId, menge, currentGepackt, kreditorId, platz, artname, minLos, uids FROM kommDetails 
            LEFT JOIN (SELECT artikelId as arid, GROUP_CONCAT(uid SEPARATOR ',') as uids FROM uiids GROUP BY arid) AS u ON artikelId = u.arid
            LEFT JOIN (SELECT artId,lagerplatz as platz,static,liferant FROM lagerplatz ) AS l ON  artikelId = l.artId AND kreditorId = l.liferant AND static = true
            LEFT JOIN (SELECT artikelId as aaid,name as artname,minLosMenge as minLos,liferantId FROM artikel) AS a ON artikelId = a.aaid  AND kreditorId = a.liferantId
            WHERE kommissId = '${kommId}' AND inBestellung = '0' AND gepackt = 'INPACKEN'  GROUP BY id HAVING SUM(menge - currentGepackt ) > 0 ORDER BY platz ASC`,
        )
        .then(
          (data) => {
            const tmpData: DataFurKomissDTO[] = [];

            Object.assign(tmpData, data);
            for (let y = 0; y < tmpData.length; y++) {
              const tmparr: string[] = [];
              let tmps = '';
              for (let i = 0; i < tmpData[y].uids.length; i++) {
                if (tmpData[y].uids[i] !== ' ') {
                  if (tmpData[y].uids[i] === ',') {
                    tmps.replace(/^\s+|\s+$/g, '');
                    tmparr.push(tmps);
                    tmps = '';
                  } else {
                    tmps += tmpData[y].uids[i];
                  }
                }
              }
              tmps.replace(/^\s+|\s+$/g, '');
              tmparr.push(tmps);

              tmpData[y].uids = tmparr;
            }

            return tmpData;
          },
          (err) => {
            // console.log(err)
            throw new Error('Kommissionierung nicht gefunden ' + err);
          },
        );
    } catch (err) {
      return err;
    }
  }
  async neuePalete(neuPal: NeuePaletteDTO): Promise<number> {
    try {
      const pal: InKomissPalletenEntity = new InKomissPalletenEntity();
      pal.id = this.helper.makePalId(4);
      pal.kommId = neuPal.kommId;
      pal.palettenTyp = neuPal.palTyp;
      pal.userId = neuPal.kommissionierId;
      pal.erwartetPaletteGewicht = neuPal.gewicht;
      return (await this.pal.save(pal)).id;
    } catch (err) {
      return err;
    }
  }
  async gewichtErfassen(neuPal: NeuePaletteDTO): Promise<number> {
    try {
      //TODO es sollt geprüft werden ob realgewicht is fast die selber wie erwartete pallete gewicht
      return await this.pal
        .findOne({
          where: {
            id: neuPal.palid,
            artikelId: 0,
            kommId: neuPal.kommId,
            paletteRealGewicht: 0,
          },
        })
        .then((data) => {
          data.paletteRealGewicht = neuPal.gewicht;
          this.pal.save(data);
          return data.paletteRealGewicht;
        });
    } catch (err) {
      return err;
    }
  }
  async addAdrtikelToPalete(art: ArtikelAufPaletteDTO) {
    try {
      return await this.kommDet
        .findOne({ where: { artikelId: art.artid, kommissId: art.kommissId } })
        .then((data) => {
          if (data.kommissId === art.kommissId) {
            data.currentGepackt += art.artikelMenge;
            data.palettennr = art.paletteid;
            const pal: InKomissPalletenEntity = new InKomissPalletenEntity();
            pal.artikelId = art.artid;
            pal.artikelMenge = art.artikelMenge;
            pal.inPaken = true;
            pal.kommId = art.kommissId;
            pal.id = art.paletteid;
            pal.userId = art.kommissionierId;
            pal.palettenTyp = art.palTyp;
            //TODO
            //es sollte noch erwartete gewicht hier sein
            if (data.currentGepackt === data.menge) {
              data.gepackt = ARTIKELSTATUS.GEPACKT;
              pal.gepackt = true;
            }
            if (art.artikelMenge < 0) {
              this.pal.delete({
                artikelId: art.artid,
                kommId: art.kommissId,
                userId: art.kommissionierId,
              });
              if (data.currentGepackt > 0) {
                pal.artikelMenge = data.currentGepackt;
                this.pal.save(pal);
              }
            } else {
              this.pal.save(pal);
            }

            return this.kommDet.save(data).then((data) => {
              if (data !== undefined && data !== null) {
                return 1;
              }
              return 0;
            });
          }
          throw new HttpException(
            'Etwas ist schieff gelaufen, kommisid nicht gefunden',
            HttpStatus.NOT_FOUND,
          );
        });
    } catch (err) {
      return err;
    }
  }
  async getlastActiveKom(kommisionierId: number): Promise<string> {
    try {
      return await this.pal
        .findOne({
          where: {
            userId: kommisionierId,
            paletteRealGewicht: 0,
            artikelId: 0,
          },
        })
        .then((data) => {
          if (data !== undefined && isFinite(data.kommId)) {
            return data.kommId + '/' + data.id + '/' + data.palettenTyp;
          }
          return '';
        });
    } catch (err) {
      return err;
    }
  }
  async getLagerPatzMitArtikel(artid: number, lieferantid: number) {
    try {
      //was brauche ich
      //lagerplatz name menge (artid and liferntid hab ich  ) lagerpaltzid
      return await this.kommDet
        .query(
          `SELECT id, lagerplatz,artId, artikelMenge, mhd, liferantn FROM lagerplatz 
          LEFT JOIN (SELECT id as did, name as liferantn FROM dispositor ) as dispo ON dispo.did = ${lieferantid}
           WHERE artId = ${artid} AND liferant = ${lieferantid} AND static = false ORDER BY mhd ASC`,
        )
        .then(
          (data) => {
            return data;
          },
          (err) => {
            console.log(err);
            throw new HttpException(
              'Etwas ist schieff gelaufen als ich lagerplatz mit dem artikel finden wollte',
              HttpStatus.NOT_FOUND,
            );
          },
        );
    } catch (err) {
      return err;
    }
  }
}
