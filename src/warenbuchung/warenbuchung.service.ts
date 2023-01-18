import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BestArtikelMengeDTO } from 'src/DTO/bestArtikelMengeDTO';
import { WarenBuchungDto } from 'src/DTO/warenBuchungDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { WarenEingStat } from 'src/entity/warenEingStat';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class WarenbuchungService {
  constructor(
    @InjectRepository(WarenEingangEntity)
    private repo: Repository<WarenEingangEntity>,
    @InjectRepository(ArtikelEntity) private artRepo: Repository<ArtikelEntity>,
    @InjectRepository(WarenEingStat)
    private repoStat: Repository<WarenEingStat>,
  ) {}

  async createBuchung(buch: WarenBuchungDto): Promise<WarenBuchungDto> {
    for (const [key, value] of Object.entries(buch)) {
      try {
        const tmp = String(value).split('-');
        if (tmp.length > 2) {
          buch[key] = this.formatDate(value);
        }
      } catch (err) {}
    }
    try {
      if (buch.artikelsGebucht === null) {
        buch.artikelsGebucht = false;
      }

      await this.repo.create(buch);
      if (buch.eingebucht && !buch.artikelsGebucht) {
        if (await this.updateArtikels(buch)) {
          buch.artikelsGebucht = true;
        }
      }
      return await this.repo.save(buch);
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  async updateArtikels(buch: WarenEingangEntity): Promise<boolean> {
    //check if object entery is date and remove hours
    for (const [key, value] of Object.entries(buch)) {
      try {
        const tmp = String(value).split('-');
        if (tmp.length > 2) {
          buch[key] = this.formatDate(value);
        }
      } catch (err) {}
    }
    let ret = false;
    if (buch.eingebucht && !buch.artikelsGebucht) {
      let buchungenFertig: WarenEingangEntity[] = [];
      buchungenFertig = await this.repo.find({
        where: { bestellungId: buch.bestellungId, artikelid: Not(IsNull()) },
      });
      if (buchungenFertig.length > 0) {
        for (let i = 0; i < buchungenFertig.length; i++) {
          await this.artRepo
            .findOneBy({
              artikelId: buchungenFertig[i].artikelid,
              liferantId: buchungenFertig[i].kreditorId,
            })
            .then(
              (data) => {
                const eingStat: WarenEingStat = new WarenEingStat();
                eingStat.artikelId = data.aid;
                eingStat.empfangDatum = buchungenFertig[i].empfangDatum;
                eingStat.menge = buchungenFertig[i].menge;
                eingStat.price = buchungenFertig[i].priceNetto;
                eingStat.mehrwertsteuer = buchungenFertig[i].mehrwertsteuer;
                eingStat.bezeichnung = data.name;
                eingStat.lieferandId = data.liferantId;
                eingStat.lieferscheinNr = buchungenFertig[i].lieferscheinNr;
                //TODO brauchen wir das ??
                eingStat.versandDatum = buchungenFertig[i].empfangDatum;

                this.repoStat.save(eingStat);
                data.bestand += buchungenFertig[i].menge;
                this.artRepo.save(data);

                ret = true;
              },
              (err) => {
                return ret;
                //TODO nicht dum save errors tu database, to vewrfolgung mögliche problemen!
              },
            );
        }
      }
    }
    return ret;
  }
  async addArtikel(best: BestArtikelMengeDTO) {
    try {
      let buch: WarenBuchungDto = new WarenBuchungDto();
      await this.repo.findOneBy({ bestellungId: best.bestellungId }).then(
        (data) => {
          buch = data;
        },
        (err) => {
          throw err;
        },
      );
      if (buch.eingebucht === true) {
        throw new HttpException(
          'Diese buchung ist schon eingebucht! Du kannst kein artikel mehr zugeben!',
          HttpStatus.FORBIDDEN,
        );
      }

      buch.id = null;
      buch.artikelid = best.artikelId;
      buch.menge = best.menge;
      buch.priceNetto = best.priceNetto;
      buch.mehrwertsteuer = best.mehrwertsteuer;
      buch.kreditorId = best.liferantId;
      await this.repo.create(buch);
      return await this.repo.save(buch);
    } catch (err) {
      return err;
    }
  }
  async deleteArtikel(artid: number, bestid: number) {
    try {
      return await this.repo.delete({ artikelid: artid, bestellungId: bestid });
    } catch (err) {
      return err;
    }
  }
  async getAllArticles(bestellungsid: number) {
    try {
      const be: BestArtikelMengeDTO[] = [];
      await this.repo
        .findBy({ bestellungId: bestellungsid, artikelid: Not(IsNull()) })
        .then(
          (datas) => {
            datas.forEach((data) => {
              const a: BestArtikelMengeDTO = new BestArtikelMengeDTO();
              a.artikelId = data.artikelid;
              a.bestellungId = data.bestellungId;
              a.menge = data.menge;
              a.mehrwertsteuer = data.mehrwertsteuer;
              a.priceNetto = data.priceNetto;
              a.liferantId = data.kreditorId;
              be.push(a);
            });
          },
          (error) => {
            console.log('leider error als ich versuchte artikels zu holen ');
          },
        );

      return be;
    } catch (err) {
      return err;
    }
  }
  async deletBuchung(id: number) {
    try {
      return await this.repo.delete({ bestellungId: id });
    } catch (err) {
      return err;
    }
  }
  async getBuchungen() {
    try {
      const tmp = await this.repo.findBy({ artikelid: IsNull() });
      const buchArr: WarenBuchungDto[] = [];
      if (tmp.length > 0) {
        tmp.forEach((dat) => {
          buchArr.push(dat);
        });
      }
      return buchArr;
    } catch (err) {
      return err;
    }
  }
  formatDate(date: Date): Date {
    return new Date(new Date(date).toDateString());
  }
}
