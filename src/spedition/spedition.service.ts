import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { speditionDTO } from 'src/DTO/speditionDTO';
import { speditionEntity } from 'src/entity/speditionEntity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeditionService {
    constructor(@InjectRepository(speditionEntity) private repo : Repository<speditionEntity>){}

    async getAllSpditors():Promise<speditionEntity[]>{
        try{
            return await this.repo.find();
        }catch(err){
            return err;
        }
    }
    async createSpeditor(speditor : speditionDTO):Promise<speditionEntity>{
        await this.repo.create(speditor);
        try{
            return await this.repo.save(speditor);
        }catch(err){
            return err;
        }
    }
    async updateSpeditor(speditor : speditionDTO, id : number){
        try{
             await this.repo.update(id, speditor);
             return await this.repo.findBy({'id' : speditor.id})
        }catch(err){
            return err;
        }
    }
    async deleteSpeditor(id : number){
        try {
            await this.repo.delete(id);
            return this.repo.find();
        }catch(err){
            return err;
        }
    }
}
