import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { Repository } from 'typeorm';

@Injectable()
export class WareausgangService {
    constructor (
    @InjectRepository(KommisioDetailsEntity) private kommDet: Repository<KommisioDetailsEntity>,
    @InjectRepository(KommissionirungEntity) private komm: Repository<KommissionirungEntity>,
    @InjectRepository(InKomissPalletenEntity) private pal: Repository<InKomissPalletenEntity>) {}

    
}
