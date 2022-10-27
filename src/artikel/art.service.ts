import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtLoader } from 'src/ArtLoader';
import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { Repository } from 'typeorm';


@Injectable()
export class ArtService {
    constructor(@InjectRepository(ArtikelEntity) private repo : Repository<ArtikelEntity>){}
    
    
    async getAllArticel():Promise<ArtikelEntity[]>{
        const create : number = 1;
                if(create === 3){
                console.log('art service');
                try{
                    var art: ArtikelEntity[] = new Array();
                    art = await this.repo.create(new ArtLoader().makeArtikels());
                await this.repo.save(art);
                }catch(err){
                    console.log(err);
                }
            }
        try {
          /*  return await this.repo.find({
                relations: {
                    uids : true
                },
            });*/
            return await this.repo.find();
        }
        catch (err) {
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async getArtikel(id: number){
        try{
            return await this.repo.createQueryBuilder("artikel")
            .leftJoinAndSelect("artikel.uids", "uids")
            .where("artikelId = :artikelId", {artikelId: id})
            .getOne();
        }catch (err){
            return err;
        }
    }
    async createArtikel(art : ArtikelDTO):Promise<ArtikelEntity>{
        await this.repo.create(art);
        

        try{
          
           return await this.repo.save(art);
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async updateArtikel(art: ArtikelDTO, id: number):Promise<ArtikelEntity>{
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
