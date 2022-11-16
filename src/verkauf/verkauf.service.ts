import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { tmpdir } from 'os';
import { AddArtikelKommissDTO } from 'src/DTO/addArtikelKommissDTO';
import { ArtikelKommissDTO } from 'src/DTO/artikelKommissDTO';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { ArtikelReservationEntity } from 'src/entity/ArtikelReservationEntity';
import { ARTIKELSTATUS, KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Helper } from 'src/helper';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class VerkaufService {
  private helper: Helper;
    constructor(@InjectRepository(KommissionirungEntity) private repo: Repository<KommissionirungEntity>,
    @InjectRepository(KommisioDetailsEntity) private repoDetails: Repository<KommisioDetailsEntity>, private repoLager: LagerService,
    @InjectRepository(ArtikelReservationEntity) private repoReserv : Repository<ArtikelReservationEntity>){

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
            throw new Error("Etwas ist schiff gelaufen in Kommiss Service on createKomm " + err);
        }
    }
    async addArtikelToKommiss(art :AddArtikelKommissDTO){
      
        let tmp : KommisioDetailsEntity = new KommisioDetailsEntity();
        try{
          if(art.artMenge === 0){
            return art;
          }
       
      let komm : KommissionirungEntity =   await this.repo.findOne({'where': {'id':art.kommNr}, 'relations': {'kommDetails': true}});
      //wollen wir das das zwiete mall das selber artikel als neue position oder einfach als beide sumiert ? hiere getrent positions
      /*await this.repoDetails.findOneBy({'artikelId':art.artikelId, 'kommissId':art.kommNr}).then(data=>{
        if(data !== null){
          Object.assign(tmp, data);
        }
      });*/
      if(komm !== undefined && komm.id !== undefined){
        tmp.artikelId = art.artikelId;
        tmp.menge = art.artMenge;
        tmp.kommissId = komm.id;
        tmp.gepackt = ARTIKELSTATUS.INPACKEN;
        if(art.kommDeatailnr !== null && art.kommDeatailnr !== undefined){
          tmp.id = art.kommDeatailnr;
        }
      }
      if(tmp.kommissId !== undefined && tmp.kommissId === art.kommNr){
       await this.repoDetails.create(tmp);
      if(komm.kommDetails.length > 0){
        let found :boolean = false;
        komm.kommDetails.forEach(data=>{
          if(data !== null && data.id === art.kommDeatailnr){
            data.menge += tmp.menge;
            found = true;
          }
        });
        if(!found){
          komm.kommDetails.push(tmp);
        }
      }else{
        komm.kommDetails = [tmp];
      }
       
       
      
      return await this.repo.save(komm).then(data=>{
       
       this.updateResevation(art.kommNr, art.artikelId, art.artMenge, art.kommDeatailnr);
        return data;
      });
      }
    }catch(err){
        throw new Error("Etwas ist schiff gelaufen in Kommiss Service on add Artikel " + err);
        
    } 
    }
    async updateResevation(komm:number, artid: number, menge:number, kommDeatilId:number){
      let tmpRes : ArtikelReservationEntity = new ArtikelReservationEntity();
      tmpRes.artikelId = artid;
     
      tmpRes.kommId = komm;
      try{
        await this.repoReserv.findOneBy({'artikelId':artid, 'kommId':komm}).then(data=>{
          if(data !== null && data.id !== null){
              tmpRes.id = data.id;
              tmpRes.menge = data.menge;
              tmpRes.menge += menge;
          
          }else{
            tmpRes.menge = menge;
          }
         });
          await this.repoReserv.create(tmpRes);
          await  this.repoReserv.save(tmpRes);
      }catch (err){
        throw new Error("Etwas ist schiff gelaufen in Kommiss serv on up reservation " + err);
        
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
    try{
      return await this.repoLager.getCurrentArtiMenge(artid).then(
        data=>{
            let tmp : ArtikelKommissDTO = new ArtikelKommissDTO();
            Object.assign(tmp, data);
            return tmp;
        });
    }catch(err){
      throw new Error("Etwas isst schiff in get Currrent menge  for 1 art "+ err);
      
    }
   
   }
   async deleteKomm(id:number){
    try{
    
         await this.repoReserv.delete({'kommId':id});
      
      return await (await this.repo.delete({'id':id})).affected;
    }catch(err){
      throw new Error("Etwas ist schieff gelaufen, ich konnte die komm nicht löschen " + err);
      
    }
   }
   async deleteArtikelFromKomm(id: number){
    let tmp : KommisioDetailsEntity = new KommisioDetailsEntity();
    try{
      await this.repoDetails.findOne({'where':{'id':id}}).then(data=>{
        if(data != null){
          tmp = data;
        }
      });
      
      if(tmp.id == null){
        return;
      } 
       return await this.repoDetails.delete({'id':id}).then(data=> {
        this.updateResevation(tmp.kommissId, tmp.artikelId, -tmp.menge, tmp.id);
         return data.affected;
        }, err=>{console.log('blad '+err)});
      
    }catch(err){
      throw new Error("Etwas ist schieff gegangen als ich wollete position in komm löschen " + err);
      
    }
   }
}
