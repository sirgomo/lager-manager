import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UidDTO } from 'lager-front/src/app/dto/artikel.dto';
import { ArtLoader } from 'src/ArtLoader';
import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
import { Repository } from 'typeorm';


@Injectable()
export class ArtService {

    artLoader : ArtLoader = new ArtLoader();
    constructor(@InjectRepository(ArtikelEntity) private repo : Repository<ArtikelEntity>, @InjectRepository(UiidEntity) private uidRepo : Repository<UiidEntity>){}
    
    private generateArtikles(){
      
        console.log('art service');
        try{
            var art: ArtikelEntity[] = new Array();
           art = this.artLoader.makeArtikels();
           art.forEach(data =>{
            this.createArtikel(data);
           })
        }catch(err){
            console.log(err);
        }
    
    }
    async getAllArticel():Promise<ArtikelEntity[]>{
        if(this.artLoader.gener){
            this.generateArtikles();
        }
       
        try {
            return await this.repo.find();
        }
        catch (err) {
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }
    async getArtikel(id: number){
        try{
            return  await this.repo.createQueryBuilder('artikel')
           .leftJoinAndSelect('artikel.uids', 'uiid' )
           .where('uiid.artikelId = :artikelId', {artikelId: id})
           .getOne();
        }catch (err){
            console.log('error sie melduje ' + err);
            return err;
        }
    }
    async createArtikel(art : ArtikelDTO):Promise<ArtikelEntity>{
       
       if(art.artikelId == null){
        try{
            let tmpUids : UidDTO[] = new Array();
            tmpUids = art.uids;
            art.uids = [];
      
            
            await this.repo.create(art);
            await this.repo.save(art).then(data => {
                tmpUids.forEach(uid => { uid.artikelId = data.artikelId});
                
                this.uidRepo.create(tmpUids);
                this.uidRepo.save(tmpUids).then( uid => {
                    data.uids = uid;
                });
                return data;
            });
           
            
        }catch(err){
            console.log(err);
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }else{
        try{
            let a = await this.uidRepo.findBy({'artikelId': art.artikelId});
            let uidsToSave: UiidEntity[] = new Array();
            let uidToDelete: UiidEntity[] = new Array();
           
            if(art.uids.length < a.length){
                uidToDelete = a;
                while(art.uids.length < uidToDelete.length){
                    art.uids.forEach(d => {
                       for(let i = 0; i < uidToDelete.length; i++){
                        if(d.id == uidToDelete[i].id){
                            uidToDelete.splice(i, 1);
                        }
                       }
                    })
                }
            }
          
            if(uidToDelete.length > 0){
                uidToDelete.forEach(d=>{
                    this.uidRepo.delete({'id': d.id, 'artikelId': d.artikelId});
                })
            
               }
              
               
                try{
                    await this.uidRepo.save(art.uids);
                    uidsToSave.splice(0, uidsToSave.length);
                }catch (err){
                    return err;
                }
                
    
           
         
   
            await this.repo.preload(art);
            return await this.repo.save(art);
        
        } catch(err){
            console.log(err);
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
        
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
            let uids = await this.uidRepo.findBy({'artikelId': id});
            uids.forEach(d => {
                this.uidRepo.delete({'id': d.id, 'artikelId': d.artikelId});
            });
            return await this.repo.delete({'artikelId':id});
        }
        catch(err){
            console.log(err);
            throw new InternalServerErrorException('Etwas is schief gegangen');
        }
    }

    async getArtikelnachUid(uid:string){
      return  await this.uidRepo.find({'where': {'uid': uid}, 'relations':{'artikelId': true} }).then(data=>{
        console.log(data);
        return data;
      });
    }
}
