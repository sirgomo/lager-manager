import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelKommissDTO } from 'src/DTO/artikelKommissDTO';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class VerkaufService {
    constructor(@InjectRepository(KommissionirungEntity) private repo: Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity) private repoDetails: Repository<KommisioDetailsEntity>, private repoLager: LagerService){

    }
   async getAllKommiss(){
        try{
            return await this.repo.find({'relations': {
                kommDetails: true
            }});
            
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on getall " + err);
            
        }
    }
   async getAllKommisByVerkaufer(verkaufer: number){
        try{
            return await this.repo.find({'relations':{
                kommDetails: true
            },
            'where': 
            {'verkauferId':verkaufer}
        });
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on getall by verkaufer " + err);
        }
    }
   async createKommiss(komm: KomissDTO){
        try{
            
            await this.repo.create(komm);
           return await   this.repo.save(komm);
          
        }catch(err){
            throw new Error("Etwas ist schif gelaufen in Komiss Service on createKomm " + err);
        }
    }
   async getArtikels(){
    let art : ArtikelKommissDTO[] = new Array();
    await this.repoLager.getArtiklesForKommiss().then(data=>{
        for(let i = 0; i !== data.length; i++){
            let tmp : ArtikelKommissDTO = new ArtikelKommissDTO();
            Object.assign(tmp, data[i]);
            art.push(tmp);
        }
    });
    return art;
   }
   async getCurrentArtikelMenge(artid:number){
   return await this.repoLager.getCurrentArtiMenge(artid).then(
        data=>{
            let tmp : ArtikelKommissDTO = new ArtikelKommissDTO();
            Object.assign(tmp, data);
            return tmp;
        }
    )
   }
}
