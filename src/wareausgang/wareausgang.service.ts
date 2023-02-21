import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async getFertigKommissionierungen() {
        try {
           // const all = await this.komm.find({where: {kommissStatus: KOMMISIONSTATUS.FERTIG}});
           const all = await this.komm.createQueryBuilder('kom')
           .select(['kom.id, kom.gewunschtesLieferDatum, kom.kommissStatus, kom.spedition, kom.versorgungId'])
           .leftJoin(UserEntity, 'user', 'user.id=kom.verkauferId')
           .addSelect(['user.vorname, user.nachname'])
           .leftJoin(DispositorEntity, 'dispo', 'dispo.id=kom.dispositorId')
           .addSelect('dispo.name', 'dispositorId')
           .where('kom.kommissStatus= :status', {status: 'FERTIG'})
           .getRawMany();
            if(all === null || all.length < 1) {
                throw new HttpException('Keine kommisionierungen gefunden', HttpStatus.NOT_FOUND);
            }
            for(let i = 0; i < all.length; i++) {
                all[i].verkauferId = all[i].vorname[0].toUpperCase() +'.'
                + all[i].nachname[0].toUpperCase() + all[i].nachname.slice(1,all[i].nachname.length);
               
            }
            console.log(all);
            return all;
        
        } catch (err) {
            return err;
        }
    }
}
