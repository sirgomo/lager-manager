import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ArtLoader } from 'src/ArtLoader';
import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtService {
  artLoader: ArtLoader = new ArtLoader();
  constructor(
    @InjectRepository(ArtikelEntity) private repo: Repository<ArtikelEntity>,
    @InjectRepository(UiidEntity) private uidRepo: Repository<UiidEntity>,
  ) {}

  private generateArtikles() {
    console.log('art service');
    try {
      let art: ArtikelEntity[] = [];
      art = this.artLoader.makeArtikels();
      art.forEach((data) => {
        this.createArtikel(data);
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getAllArticel(): Promise<ArtikelEntity[]> {
    if (this.artLoader.gener) {
      this.generateArtikles();
    }

    try {
      return await this.repo.find({
        select: {
          aid: true,
          artikelId: true,
          name: true,
          minLosMenge: true,
          liferantId: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException('Etwas is schief gegangen ' + err);
    }
  }
  async getArtikel(aid: number) {
    try {
      return await this.repo
        .findOne({ relations: { uids: true }, where: { aid: aid } })
        .then(
          (data) => {
            return data;
          },
          (err) => {
            console.log(err);
            return err;
          },
        );
    } catch (err) {
      console.log('error sie melduje ' + err);
      return err;
    }
  }
  async getArtikelFurLager(artid: number) {
    try {
      /* let a = await this.repo.createQueryBuilder('artikel')
            .leftJoinAndSelect('artikel.uids', 'uiid'  )
            .where('uiid.artikelId = :artikelId', {artikelId: artid})
            .getQuery();
            console.log(a);*/
      return await this.repo.findOne({ where: { artikelId: artid } });
    } catch (err) {
      console.log('error sie melduje ' + err);
      return err;
    }
  }
  async createArtikel(art: ArtikelDTO): Promise<ArtikelEntity> {
    try {
      await this.repo.create(art);
      return await this.repo.save(art);
    } catch (err) {
      throw new Error('Etwas ist schif gegange beim artikel erstellen' + err);
    }
  }

  async updateArtikel(art: ArtikelDTO) {
    await this.repo.create(art);
    try {
      return await this.repo
        .findOne({ where: { aid: art.aid }, relations: { uids: true } })
        .then((data) => {
          if (
            art.uids.length !== undefined &&
            data.uids.length !== undefined &&
            data.uids.length > art.uids.length
          ) {
            const del = data.uids.length;
            for (let i = 0; i < del; i++) {
              let delIt = true;
              for (let d = 0; d < art.uids.length; d++) {
                if (data.uids[i].id == art.uids[d].id) {
                  delIt = false;
                }
              }
              if (delIt) {
                this.uidRepo.delete({
                  id: data.uids[i].id,
                  aid: data.aid,
                  artikelId: data.artikelId,
                });
              }
            }
            return this.repo.save(art).then(
              (data) => {
                if (data !== null) return 1;
              },
              (err) => {
                console.log(err);
              },
            );
          } else {
            console.log(JSON.stringify(art));
            return this.repo.save(art).then(
              (data) => {
                if (data !== null) return 1;
              },
              (err) => {
                console.log(err);
              },
            );
          }
        });
      // return await (await this.repo.update({'aid':art.aid}, art)).affected;
    } catch (err) {
      throw new Error('Etwas ist schief gelaufen beim artikel update ' + err);
    }
  }
  async deleteArtikel(id: number) {
    try {
      const uids = await this.uidRepo.findBy({ artikelId: id });
      uids.forEach((d) => {
        this.uidRepo.delete({ id: d.id, artikelId: d.artikelId });
      });
      return await this.repo.delete({ aid: id });
    } catch (err) {
      throw new InternalServerErrorException('Etwas is schief gegangen');
    }
  }

  async getArtikelnachUid(uid: string) {
    return await this.uidRepo
      .find({ where: { uid: uid }, relations: { artikelId: true } })
      .then((data) => {
        return data;
      });
  }
}
