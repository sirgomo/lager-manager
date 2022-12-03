import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DispositorsDTO } from "src/DTO/DispositorsDTO";
import { DispositorEntity } from "src/entity/dispositorEntity";
import { ROLE, UserEntity } from "src/entity/UserEntity";
import { Repository } from "typeorm";
@Injectable()
export class DisServiceService {
    constructor(@InjectRepository(DispositorEntity) private repo : Repository<DispositorEntity> ) {}

   async getAllDisponets():Promise<DispositorEntity[]>{
    try {
        return await this.repo.find();
    } catch (err){
        throw new Error("Etwas ist schiff gelaufen, ich konnte dispositoren nicht finden");
        
    }
   
   }
   async createDisponets(dispo : DispositorsDTO)
   {
       await this.repo.create(dispo);
        try {
        return await this.repo.save(dispo);
        }
        catch(err) {
            throw new Error("Etwas ist schiff gelaufen, ich kann dipositor nicht erstellen");
        }
   
   }
   async updateDipositors(id : number, dispo : DispositorsDTO)
   {
   
        try {
            return await this.repo.update(id, dispo);
        } catch (err){
            throw new Error("Etwas ist schiff gelaufen, ich kann dipositor nicht aktualisiren");
        }
   
   }
   async deleteDiponent(id : number){
   
        try{
            return await (await this.repo.delete(id)).affected;
        }
        catch (err) {
            throw new Error("Etwas ist schiff gelaufen, ich kann dipositor nicht löschen");    
        }
 
   }
}