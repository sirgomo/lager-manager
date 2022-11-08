import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';

import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { LagerPlatzEntity, PALETTENTYP } from 'src/entity/LagerPlatzEntity';
import { Helper } from 'src/helper';
import { LagerPlatzGenerator } from 'src/lagerPlatzGen';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';

@Injectable()
export class LagerService {
    lagerGen : LagerPlatzGenerator = new LagerPlatzGenerator();
    StellPlatze : LagerPlatztDTO[] = new Array();
    helper : Helper = new Helper();
    constructor(@InjectRepository(LagerPlatzEntity) private repo: Repository<LagerPlatzEntity>, private artServ: ArtService){}
  
    private genereLagaPlatze(){
        
        this.StellPlatze =   this.lagerGen.getRegals();
        this.StellPlatze.forEach(
            data => {
            this.createLagerPlatz(data);
            });
    }
    async getStellpletze(){
        try{
        //  await  this.genereLagaPlatze();
            let lagerPlatz: LagerPlatztDTO[] = new Array();
         
        
            await this.repo.query(`SELECT lagerplatz.*, artikel.name FROM lagerplatz LEFT JOIN artikel ON lagerplatz.artId = artikel.artikelId ORDER BY ISNULL(artId) ASC`)
            .then(data => {
                data.forEach(element => {
                   let tmp : LagerPlatztDTO = new LagerPlatztDTO();
                   Object.assign(tmp, element);
                   lagerPlatz.push(tmp);
                });
              
            })
            
         
            return lagerPlatz;
        }catch( err){
            throw new Error("problem mit lager service, lagerservice kann nicht lagerplatz machen");
        }
    }
    async createLagerPlatz(lagerplatz : LagerPlatztDTO):Promise<LagerService>{
        try{
           console.log(lagerplatz);
            await this.repo.create(lagerplatz);
            return await this.repo.save(lagerplatz)
            .then(data=>{
            return lagerplatz = data;  
            }, err => {
                return err;
            });
        }catch( err){
            console.log(err);
            throw new Error("problem mit lager service, lagerservice kann nicht lagerplatz erstellen");
            
        }
    }
    async deleteLageplatzt(id : number){
        try{
       await  this.repo.findOneBy({'id': id}).then(data => {
                if(data.artId !== null || data.artikelMenge !== null){
                    throw new Error("Der Lagerplatz ist besetzt !!");
                    
                }
            });
         return  await this.repo.delete({'id': id}); 

        }catch(err){
            throw new Error("Etwas ist schief gegangen " + err);
        }
    }

    async getPlatzFurArtikel(artMen: ArtikelMengeDTO){
        try{
            let volMenge : number[][] = new Array();
            let artikel :ArtikelDTO = new ArtikelDTO();
            await this.artServ.getArtikel(artMen.artikelId).then(data => { artikel = data});
            volMenge =  this.helper.getPaletenVolumen(artikel.bestand, artikel.grosse, artikel.minLosMenge, 205);
            let neue: boolean = true;
            await  this.repo.findOneBy({'artId':artikel.artikelId}).then(data=>{
              if(data && data.artId !== null)  neue = false;  
             
           }, err=>{ console.log( err)});
           if(neue){
            return await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true , 'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
              'lagerPlatzVolumen': MoreThanOrEqual(volMenge[0][0]), 'static': true}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
             return data;
              }, err=>{
                  console.log(err);
                  return err;
              });
           }else{
            if(artMen.palete !== PALETTENTYP.KEINPALETTE){
           return  await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
              'lagerPlatzVolumen': MoreThanOrEqual(volMenge[0][0]), 'static':false}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
             return data;
              }, err=>{
                  return err;
              });
            }else{
                let tmp : LagerPlatzEntity = new LagerPlatzEntity();
              
                tmp = await this.repo.findOneBy({'artId': artMen.artikelId, 'static': true});
                if(this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                artMen.mhd === undefined || this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                artMen.mhd === tmp.mhd ){
                    return tmp;
                }else{
                    return  await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
                    'lagerPlatzVolumen': MoreThanOrEqual(volMenge[0][0]), 'static':true}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
                   return data;
                    }, err=>{
                        return err;
                    });
                }
              

            }
           }
        }catch( err){
            throw new Error(" Cant find lagerplatz fur artikel " + err);
            
        }
    }
    //generator  
   /* async getPlatzFurArtikel(artMen: ArtikelMengeDTO){
        try{
          let lagerplatze : LagerPlatztDTO[] = new Array();  
            let volMenge : number[][] = new Array();
            let artikel :ArtikelDTO = new ArtikelDTO();
            let artikeles: ArtikelDTO[] = new Array();
           await (await this.artServ.getAllArticel()).forEach(dataall => { artikeles.push(dataall)});
           for (let y = 0; y<  artikeles.length ; y++){
            
          artikel = artikeles[y];
           // await this.artServ.getArtikel( artikeles[y].artikelId).then(dataone =>{ artikel = dataone}, err => {console.log(err)});
           

          volMenge =  this.helper.getPaletenVolumen(artikel.bestand, artikel.grosse, artikel.minLosMenge, 205);
        
        

       for(let i = 0; i < volMenge.length; i++){
          
         if(i === 0){
         
           await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
            'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static': true}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
             //   console.log( 'szukany volumen ' + volMenge[i][0] + ' ilosc sztuk ' + volMenge[i][1]);
             data.artId = artikel.artikelId;
             data.artikelMenge = volMenge[i][1];
             data.mhd = this.helper.getRandomMhd();
             data.einheit = artikel.basisEinheit;
             data.palettenTyp = PALETTENTYP.EU;
             this.repo.save(data);
              lagerplatze.push(data);
            }, err=>{
                console.log(err);
                return err;
            });
         }else{
           // return   await this.repo.findOne({select: {'lagerplatz': true,'artId': true, 'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
           await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
            'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static':false}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
              //  console.log( 'szukany volumen ' + volMenge[i][0] + ' ilosc sztuk ' + volMenge[i][1]);
             data.artId = artikel.artikelId;
             data.artikelMenge = volMenge[i][1];
             data.mhd = this.helper.getRandomMhd();
             data.einheit = artikel.basisEinheit;
             data.palettenTyp = PALETTENTYP.EU;
             this.repo.save(data);
            
                lagerplatze.push(data);
            }, err=>{
                return err;
            });
         }
      
        }
        
    }
        
          return lagerplatze;  
        }catch(err){
            throw new Error("lagerservice konnte kein platz für artikel finden" + err);
            
        }
       
    }*/
    //koniec generatora
  
}
