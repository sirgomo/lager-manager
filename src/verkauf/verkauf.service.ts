import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Repository } from 'typeorm';

@Injectable()
export class VerkaufService {
    constructor(@InjectRepository(KommissionirungEntity) private repo: Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity) private repoDetails: Repository<KommisioDetailsEntity>){

    }
    getAllKommiss(){
        try{
            return this.repo.find({'relations': {
                kommDetails: true
            }});
            
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on getall " + err);
            
        }
    }
    getAllKommisByVerkaufer(verkaufer: number){
        try{
            return this.repo.find({'relations':{
                kommDetails: true
            },
            'where': 
            {'verkauferId':verkaufer}
        });
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on getall by verkaufer " + err);
        }
    }
    createKommiss(komm: KomissDTO){
        try{
          
        this.repo.create(komm);
        this.repo.save(komm);
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on createKomm " + err);
        }
    }
}
