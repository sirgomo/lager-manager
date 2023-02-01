import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DispositorsDTO } from "src/DTO/dispositorsDTO";
import { DispositorEntity } from "src/entity/dispositorEntity";
import { Repository } from "typeorm";
@Injectable()
export class DisServiceService {
    constructor(@InjectRepository(DispositorEntity) private repo : Repository<DispositorEntity> ) {}

   async getAllDisponets():Promise<DispositorEntity[]>{
    try {
        let debitors:number = await (await this.repo.findAndCount())[1];
        if(debitors === 0){
            this.repo.query(`insert INTO dispositor (name, name2, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('koscin', 'ocok', 'hamburg', 'ajksdh 23', '24345', '11111112')`);
            this.repo.query(`insert INTO dispositor (name, name2, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('jotek', '', 'kiel', 'ajksdh 23', '24345', '11111112')`);
            this.repo.query(`insert INTO dispositor (name, name2, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('mastal', 'bocos', 'asdasd', 'ajsdksdh 23', '24345', '11111112')`);
            this.repo.query(`insert INTO dispositor (name, name2, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('oki doki', '', 'asdasd', 'asdasjksdh 23', '24345', '11111112')`);
            this.repo.query(`insert INTO dispositor (name, name2, stadt, strasseUndNr, postleitzahl, uStIdentifikationsnummer) VALUES ('no no', '', 'asdasd', 'asdjksdh 23', '24345', '11111112')`);
        }
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