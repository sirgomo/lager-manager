import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { komissDTO } from 'src/DTO/komissDTO';
import { ARTIKELSTATUS, kommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { kommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { Repository } from 'typeorm';

@Injectable()
export class KommissionierService {
    constructor(@InjectRepository(kommissionirungEntity) private repo : Repository<kommissionirungEntity>,
    @InjectRepository(kommisioDetailsEntity) private repoDetails : Repository<kommisioDetailsEntity>){}

    async getAllKomisionirungen():Promise<kommissionirungEntity[]>{
        try{
            return await this.repo.find();
        }catch (err){
            return err ;
        }
    }
    async getAllKomissionierungenByVerkaufer(id : number):Promise<kommissionirungEntity[]>{
      
        try{
            return await this.repo.findBy({'verkauferId' : id});
        }catch(err){
            return err;
        }
    }
    async createKommiss(komisDTO: komissDTO, verkauferId : number):Promise<komissDTO>{
        komisDTO.verkauferId = verkauferId;
     
        await this.repo.create(komisDTO);
        await this.repo.save(komisDTO);
        komisDTO.kommDetails = new kommisioDetailsEntity();
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
