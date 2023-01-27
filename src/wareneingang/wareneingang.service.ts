import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { WarenEingArticleDTO } from 'src/DTO/warenEingArticleDTO';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class WareneingangService {
  constructor(
    @InjectRepository(WarenEingangEntity)
    private serv: Repository<WarenEingangEntity>,
    private lagerSerr: LagerService,
  ) {}

  async getAllBuchngen(): Promise<WarenEingangEntity[]> {
    try {
      return await this.serv
        .find({ where: { eingebucht: true, artikelsGebucht: true } })
        .then();
    } catch (err) {
      throw new Error(
        'Etwas ist schieff gegangen wenn ich versuchte buchungen zu finden',
      );
    }
  }
  async getArtikels(bestellungid: number) {
    const artikles: WarenEingArticleDTO[] = [];
    try {
      await this.serv
        .query(
          `SELECT wareneingang.id,wareneingang.bestellungid, wareneingang.artikelid, wareneingang.menge,wareneingang.kreditorId, artikel.name, artikel.aid, artikel.liferantId 
         FROM wareneingang LEFT JOIN artikel ON wareneingang.artikelid = artikel.artikelId AND wareneingang.kreditorId = artikel.liferantId WHERE wareneingang.bestellungid = '${bestellungid}' 
         AND wareneingang.artikelid IS NOT NULL`,
        )
        .then((data) => {
          data.forEach((art) => {
            if (art) {
              const tmp: WarenEingArticleDTO = new WarenEingArticleDTO();
              Object.assign(tmp, art);
              artikles.push(tmp);
            }
          });
        });
      return artikles;
    } catch (err) {
      throw new Error(
        'Etwas ist schieff genagen als ich veruchte Artikles zu holen' + err,
      );
    }
  }
  async delArtikel(artikelid: number, bestellid: number) {
    try {
      await this.serv.delete({ id: artikelid, bestellungId: bestellid });
      await this.serv
        .findAndCountBy({ bestellungId: bestellid })
        .then((data) => {
          if (data[1] === 1) {
            this.serv.delete({ bestellungId: bestellid });
          }
        });
    } catch (err) {
      throw new Error(
        'Etwas ist schieff, kann nicht eingegeben artikel löschen',
      );
    }
  }
  async getPlatz(art: ArtikelMengeDTO): Promise<LagerPlatzEntity> {
    return await this.lagerSerr.getPlatzFurArtikel(art);
  }
  async lageEs(art: LagerPlatztDTO) {
    return await this.lagerSerr.patchLagerplatz(art);
  }
  async updateArtikel(art: WarenEingArticleDTO) {
    try {
      return await this.serv
        .findOneBy({ id: art.id, bestellungId: art.bestellungid })
        .then(
          (data) => {
            data.menge -= art.menge;
            this.serv.save(data);
            return data;
          },
          (err) => {
            console.log(err);
          },
        );
    } catch (err) {
      throw new Error(
        'Etwas ist schieff gegangen, ich kann der artikel nicht ändern',
      );
    }
  }
  async getPlatzeInGanges(nr: number) {
    return await this.lagerSerr.getPlattzeImGangs(nr);
  }
  async getPlatzeCount() {
    return await this.lagerSerr.getCountOfPlatze();
  }
  async getStaticPlatzeMitArtikel(artid: number, liferant: number) {
    return await this.lagerSerr.getStaticPlatzeMitWare(artid, liferant);
  }
  async getPlatzOnScan(bar: string) {
    return await this.lagerSerr.getPlattzOnBarScan(bar);
  }
}
