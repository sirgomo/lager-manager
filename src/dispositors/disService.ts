import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { dispositorsDto } from "src/DTO/dispositorsDTO";
import { dispoEntity } from "src/entity/dispoEntity";
import { ROLE, userEntity } from "src/entity/userEntity";
import { Repository } from "typeorm";
@Injectable()
export class DisServiceService {
    constructor(@InjectRepository(dispoEntity) private repo : Repository<dispoEntity> ) {}

   async getAllDisponets():Promise<dispoEntity[]>{
    try {
        return await this.repo.find();
    } catch (err){
        return err;
    }
   
   }
   async createDisponets(dispo : dispositorsDto)
   {
    console.log('tutaj cvonstroller')
       await this.repo.create(dispo);
        try {
        return await this.repo.save(dispo);
        }
        catch(err) {
            return err;
        }
   
   }
   async updateDipositors(id : number, dispo : dispositorsDto)
   {
   
        try {
            return await this.repo.update(id, dispo);
        } catch (err){
            return err;
        }
   
   }
   async deleteDiponent(id : number){
   
        try{
            return await this.repo.delete(id);
        }
        catch (err) {
            return err;        
        }
 
   }
}