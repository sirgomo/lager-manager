import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async createArtikel(art : artikelDTO):Promise<artikelEntity>{
        this.repo.create(art);
        try{
           return await this.repo.save(art);
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async updateArtikel(art: artikelDTO, id: number):Promise<artikelEntity>{
        this.repo.create(art);
        try{
            await this.repo.update(id, art);
            return this.repo.findOneBy({'id':id});
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async deleteArtikel(id: number){
        try{
            await this.repo.delete({'id':id});
        }
        catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
}
