import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { LagerPlatzGenerator } from 'src/lagerPlatzGen';
import { Repository } from 'typeorm';

@Injectable()
export class LagerService {
    lagerGen : LagerPlatzGenerator = new LagerPlatzGenerator();
    StellPlatze : LagerPlatztDTO[] = new Array();
    constructor(@InjectRepository(LagerPlatzEntity) private repo: Repository<LagerPlatzEntity>){}
  
    private genereLagaPlatze(){
        
        this.StellPlatze =   this.lagerGen.getRegals();
        this.StellPlatze.forEach(
            data => {
            this.createLagerPlatz(data);
            });
    }
    async getStellpletze(){
        try{
           // this.genereLagaPlatze();
            return await this.repo.find();
        }catch( err){
            throw new Error("problem mit lager service, lagerservice kann nicht lagerplatz machen");
        }
    }
    async createLagerPlatz(lagerplatz : LagerPlatztDTO):Promise<LagerService>{
        try{
            await this.repo.create(lagerplatz);
            return await this.repo.save(lagerplatz)
            .then(data=>{
            return lagerplatz = data;  
            }, err => {
                return err;
            });
        }catch( err){
            console.log(err);
            throw new Error("problem mit lager service, lagerservice kann nicht lagerplatz machen");
            
        }
    }
 
  
}
