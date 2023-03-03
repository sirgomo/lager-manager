import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { DispositorEntity } from 'src/entity/dispositorEntity';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KOMMISIONSTATUS, KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { UserEntity } from 'src/entity/userEntity';
import { Repository } from 'typeorm';

@Injectable()
export class WareausgangService {
    constructor (
    @InjectRepository(KommisioDetailsEntity) private kommDet: Repository<KommisioDetailsEntity>,
    @InjectRepository(KommissionirungEntity) private komm: Repository<KommissionirungEntity>,
    @InjectRepository(InKomissPalletenEntity) private pal: Repository<InKomissPalletenEntity>,
    ) {}

    async getFertigKommissionierungen(status: string) {
        try {
           // const all = await this.komm.find({where: {kommissStatus: KOMMISIONSTATUS.FERTIG}});
           const all = await this.komm.createQueryBuilder('kom')
           .select(['kom.id, kom.gewunschtesLieferDatum, kom.kommissStatus, kom.spedition, kom.versorgungId, kom.rausDatum'])
           .leftJoin(UserEntity, 'user', 'user.id=kom.verkauferId')
           .addSelect(['user.vorname, user.nachname'])
           .leftJoin(DispositorEntity, 'dispo', 'dispo.id=kom.dispositorId')
           .addSelect('dispo.name', 'dispositorId')
           .where('kom.kommissStatus= :status', {status: status})
           .orderBy('kom.rausDatum', 'ASC')
           .getRawMany();
            if(all === null || all.length < 1) {
                throw new HttpException('Keine kommisionierungen gefunden', HttpStatus.NOT_FOUND);
            }
            for(let i = 0; i < all.length; i++) {
                all[i].verkauferId = all[i].vorname[0].toUpperCase() +'.'
                + all[i].nachname[0].toUpperCase() + all[i].nachname.slice(1,all[i].nachname.length);
               
            }
            return all;
        
        } catch (err) {
            return err;
        }
    }
    async getKommiessionierung(nr: number) {
        try {
            const com: KommissionirungEntity = await this.komm.createQueryBuilder('kom')
            .select(['kom.*'])
           // .leftJoin(KommisioDetailsEntity, 'komd', 'komd.kommissId='+nr+' AND komd.inBestellung=0')
            //.addSelect()          
           
            .where('kom.id= :id', {id: nr})
            .getRawOne().catch((err) => {
                console.log(err);
            });
            const query = await this.kommDet.createQueryBuilder('komd')
            .select(['komd.id', 'komd.artikelId', 'komd.menge', 'komd.palettennr', 'komd.kreditorId'])
            .leftJoin(InKomissPalletenEntity, 'ink', 'ink.kommId=komd.id OR ink.kommId='+nr)
            .addSelect(['ink.palettenTyp', 'ink.lkwNummer', 'ink.paletteRealGewicht'])
            .leftJoin(ArtikelEntity, 'art', 'art.artikelId=komd.artikelId AND art.liferantId=komd.kreditorId')
            .addSelect(['art.gewicht', 'art.basisEinheit','art.minLosMenge', 'art.mehrwertsteuer'])
            .where('komd.kommissId= :komid', {komid: nr})
            .groupBy('komd.id')
            .getRawMany().then((d) => {
                console.log(d);
                return d;
            });
            com.kommDetails = query;
            
          // console.log(com);
            return com;
        } catch (err) {
            return err;
        }
       
    }
}
