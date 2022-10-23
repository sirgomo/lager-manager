import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uiidEntity } from 'src/entity/uiidEntity';
import { Repository } from 'typeorm';

@Injectable()
export class UidService {
    constructor(@InjectRepository(uiidEntity) private repo: Repository<uiidEntity>){}
    async saveUid( uid : uiidEntity){
        await this.repo.create(uid);
        return await this.repo.save(uid);
    }
    async deleteUid(uid : string){
        return await this.repo.delete(uid);
    }
    async getUids(artikelId : number){
        return await this.repo.findBy({'artikelId' :artikelId});
    }
}
