import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DispositorsDTO } from "src/DTO/DispositorsDTO";
import { DispoEntity } from "src/entity/DispoEntity";
import { ROLE, UserEntity } from "src/entity/UserEntity";
import { Repository } from "typeorm";
@Injectable()
export class DisServiceService {
    constructor(@InjectRepository(DispoEntity) private repo : Repository<DispoEntity> ) {}

   async getAllDisponets():Promise<DispoEntity[]>{
    try {
        return await this.repo.find();
    } catch (err){
        return err;
    }
   
   }
   async createDisponets(dispo : DispositorsDTO)
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
   async updateDipositors(id : number, dispo : DispositorsDTO)
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