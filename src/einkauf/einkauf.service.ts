import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WarenBestellungEntity } from 'src/entity/WarenBestellungEntity';
import { Repository } from 'typeorm';

@Injectable()
export class EinkaufService {
    constructor(@InjectRepository(WarenBestellungEntity) private repo: Repository<WarenBestellungEntity>){}

    
}
