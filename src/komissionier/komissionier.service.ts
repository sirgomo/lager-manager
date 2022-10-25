import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { ARTIKELSTATUS, KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Repository } from 'typeorm';

@Injectable()
export class KommissionierService {
    constructor(@InjectRepository(KommissionirungEntity) private repo : Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity) private repoDetails : Repository<KommisioDetailsEntity>){}

    async getAllKomisionirungen():Promise<KommissionirungEntity[]>{
        try{
            return await this.repo.find();
        }catch (err){
            return err ;
        }
    }
    async getAllKomissionierungenByVerkaufer(id : number):Promise<KommissionirungEntity[]>{
      
        try{
            return await this.repo.findBy({'verkauferId' : id});
        }catch(err){
            return err;
        }
    }
    async createKommiss(komisDTO: KomissDTO, verkauferId : number):Promise<KomissDTO>{
        komisDTO.verkauferId = verkauferId;
     
        await this.repo.create(komisDTO);
        await this.repo.save(komisDTO);
        komisDTO.kommDetails = new KommisioDetailsEntity();
        komisDTO.kommDetails.gepackt = ARTIKELSTATUS.INPACKEN; 
      //  komisDTO.kommDetails.kommissId = komisDTO.id;
        await this.repoDetails.create (komisDTO.kommDetails);
        komisDTO.kommDetails =  await this.repoDetails.save(komisDTO.kommDetails);
       
       
        try{
            return komisDTO;
            
        }catch(err)
        {
            return err;
        }
    }
    async deleteKomm(id : number, verkauferId : number){
        await this.repo.delete({'id': id});
     //   await this.repoDetails.delete({'kommissId' : id})
        return this.getAllKomissionierungenByVerkaufer(verkauferId);
    }
   
}
