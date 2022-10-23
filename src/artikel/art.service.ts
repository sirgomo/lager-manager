import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { artLoader } from 'src/artLoader';
import { artikelDTO } from 'src/DTO/artikelDTO';
import { artikelEntity } from 'src/entity/artikelEntity';
import { Repository } from 'typeorm';


@Injectable()
export class artService {
    constructor(@InjectRepository(artikelEntity) private repo : Repository<artikelEntity>){}
    
    
    async getAllArticel():Promise<artikelEntity[]>{
        const create : number = 3;
        if(create === 1){
        console.log('art service');
        try{
            var art: artikelEntity[] = new Array();
            art = await this.repo.create(new artLoader().makeArtikels());
          await this.repo.save(art);
        }catch(err){
            console.log(err);
        }
    }
        try {
            return await this.repo.find();
        }
        catch (err) {
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async createArtikel(art : artikelDTO):Promise<artikelEntity>{
        await this.repo.create(art);
        

        try{
          
           return await this.repo.save(art);
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async updateArtikel(art: artikelDTO, id: number):Promise<artikelEntity>{
        await this.repo.create(art);
       
        try{
            await this.repo.update(id, art);
            return await this.repo.findOneBy({'artikelId':id});
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async deleteArtikel(id: number){
        try{
            await this.repo.delete({'artikelId':id});
        }
        catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
}
