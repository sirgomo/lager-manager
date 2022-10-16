import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { artLoader } from 'src/artLoader';
import { artikelDTO } from 'src/DTO/artikelDTO';
import { artikelEntity } from 'src/entity/artikelEntity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtserviceService {
    constructor(@InjectRepository(artikelEntity) private repo : Repository<artikelEntity>){}
    
    
    async getAllArticel():Promise<artikelEntity[]>{
      /*  console.log('art service');
        try{
            var art: artikelEntity[] = new Array();
            art = this.repo.create(new artLoader().makeArtikels());
          await this.repo.save(art);
        }catch(err){
            console.log(err);
        }*/
        try {
            return await this.repo.find();
        }
        catch (err) {
            return err;
        }
    }
    async createArtikel(art : artikelDTO):Promise<artikelEntity>{
        this.repo.create(art);
        try{
            await this.repo.save(art);
        }catch(err){
            return err;
        }
    }
}
