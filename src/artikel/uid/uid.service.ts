import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UiidEntity } from 'src/entity/UiidEntity';
import { Repository } from 'typeorm';

@Injectable()
export class UidService {
    constructor(@InjectRepository(UiidEntity) private repo: Repository<UiidEntity>){}
    async saveUid( uid : UiidEntity){
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
