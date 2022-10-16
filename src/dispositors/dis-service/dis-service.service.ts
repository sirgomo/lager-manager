import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { dispositorsDto } from "src/DTO/dispositorsDto";
import { dispoEntity } from "src/entity/dispoEntity";
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
      this.repo.create(dispo);
      try {
       return await this.repo.save(dispo);
      }
      catch(err) {
        return err;
      }
   }
}