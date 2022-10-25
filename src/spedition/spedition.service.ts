import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpeditionDTO } from 'src/DTO/SpeditionDTO';
import { SpeditionEntity } from 'src/entity/SpeditionEntity';
import { Repository } from 'typeorm';

@Injectable()
export class SpeditionService {
    constructor(@InjectRepository(SpeditionEntity) private repo : Repository<SpeditionEntity>){}

    async getAllSpditors():Promise<SpeditionEntity[]>{
        try{
            return await this.repo.find();
        }catch(err){
            return err;
        }
    }
    async createSpeditor(speditor : SpeditionDTO):Promise<SpeditionEntity>{
        await this.repo.create(speditor);
        try{
            return await this.repo.save(speditor);
        }catch(err){
            return err;
        }
    }
    async updateSpeditor(speditor : SpeditionDTO, id : number){
        try{
             await this.repo.update(id, speditor);
             return await this.repo.findBy({'id' : speditor.id})
        }catch(err){
            return err;
        }
    }
    async deleteSpeditor(id : number){
        try {
           return await this.repo.delete(id);
           
        }catch(err){
            return err;
        }
    }
}
