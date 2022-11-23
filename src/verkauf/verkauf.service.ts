import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddArtikelKommissDTO } from 'src/DTO/addArtikelKommissDTO';
import { ArtikelKommissDTO } from 'src/DTO/artikelKommissDTO';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { PalettenMengeVorausDTO } from 'src/DTO/palettenMengeVorausDTO';
import { ArtikelReservationEntity } from 'src/entity/ArtikelReservationEntity';
import { ARTIKELSTATUS, KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Helper } from 'src/helper';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class VerkaufService {
  private helper: Helper = new Helper();
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
    async addArtikelToKommiss(art :AddArtikelKommissDTO[]){
      let kommArr: KommissionirungEntity[] = new Array();
      for(let i = 0; i !== art.length; i++){
        let tmp : KommisioDetailsEntity = new KommisioDetailsEntity();
        try{
          if(art[i].artMenge === 0){
          throw new Error("Artikel mange darf nicht 0 sein");
          
          }
       
      let komm : KommissionirungEntity =   await this.repo.findOne({'where': {'id':art[i].kommNr}, 'relations': {'kommDetails': true}});
      //wollen wir das das zwiete mall das selber artikel als neue position oder einfach als beide sumiert ? hiere getrent positions
      /*await this.repoDetails.findOneBy({'artikelId':art.artikelId, 'kommissId':art.kommNr}).then(data=>{
        if(data !== null){
          Object.assign(tmp, data);
        }
      });*/

      //haben wir genug davon ? 
      let artToCheck :ArtikelKommissDTO = new ArtikelKommissDTO(); 
      await this.repoLager.getCurrentArtiMenge(art[i].artikelId).then(data=>{
        artToCheck = data;
      });
      if(artToCheck !== null){
        if(artToCheck.total < art[i].artMenge && !art[i].inBestellung){
         throw new Error("Nicht genug Artikel !!");
        }
      }
      tmp.inBestellung = art[i].inBestellung;
      if(komm !== undefined && komm.id !== undefined){
        tmp.artikelId = art[i].artikelId;
        tmp.menge = art[i].artMenge;
        tmp.kommissId = komm.id;
        tmp.gepackt = ARTIKELSTATUS.INPACKEN;
       
        if(art[i].kommDeatailnr !== null && art[i].kommDeatailnr !== undefined){
          tmp.id = art[i].kommDeatailnr;
        }
      }
      if(tmp.kommissId !== undefined && tmp.kommissId === art[i].kommNr){
       await this.repoDetails.create(tmp);
      if(komm.kommDetails.length > 0){
        let found :boolean = false;
        komm.kommDetails.forEach(data=>{
          if(data !== null && data.id === art[i].kommDeatailnr){
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
       
       
      
     kommArr[i] =  await this.repo.save(komm).then(data=>{
      if(!data) return;
       if(!tmp.inBestellung)
       {
        this.updateResevation(art[i].kommNr, art[i].artikelId, art[i].artMenge, art[i].kommDeatailnr);
       }
        return data;
      });
    }
    }catch(err){
        throw new Error("Etwas ist schiff gelaufen in Kommiss Service on add Artikel " + err);
        
    }
  }
  console.log(JSON.stringify(kommArr));
  return kommArr;
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
        if(!tmp.inBestellung)
        {
        this.updateResevation(tmp.kommissId, tmp.artikelId, -tmp.menge, tmp.id);
        }
         return data.affected;
        }, err=>{console.log('blad '+err)});
      
    }catch(err){
      throw new Error("Etwas ist schieff gegangen als ich wollete position in komm löschen " + err);
      
    }
  }
  async getVorausgesehenPaletenMenge(komissId: number){
    let artikels : PalettenMengeVorausDTO[] = new Array();
    let totalgewicht : number = 0;
  
    let komm: KommissionirungEntity = new KommissionirungEntity();
    komm = await this.repo.findOneBy({'id': komissId});
    return await this.repoDetails.query(`SELECT kommDetails.artikelId, menge, gepackt, statlagerplatz, paleteTyp,artikel.artikelId, artikel.name, artikel.minLosMenge,
    artikel.grosse, artikel.gewicht, artikel.basisEinheit, artikel.artikelFlage FROM kommDetails 
    LEFT JOIN artikel ON artikel.artikelId = kommDetails.artikelId
    LEFT JOIN (SELECT artId, lagerplatz AS statlagerplatz, palettenTyp AS paleteTyp FROM lagerplatz WHERE static = true ) lagerplatz ON lagerplatz.artId = kommDetails.artikelId
    WHERE kommissId = '${komissId}' AND inBestellung = false ORDER BY statlagerplatz ASC` ).then(data=>{
     for(let i = 0; i !== data.length; i++){
      let art :PalettenMengeVorausDTO = new PalettenMengeVorausDTO();
      Object.assign(art,data[i]); 
      artikels.push(art);
      
     }
     this.helper.getTotalPalettenMenge(komm.maxPalettenHoher, artikels, komissId);
     console.log('totalgewicht '+ totalgewicht);
     return artikels;
    });
   
  }
}