import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';

import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
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
    private async lagerArtikels(){
        let artikels: ArtikelMengeDTO[] = new Array();
       
       let tmp = await this.artServ.getAllArticel();
            tmp.forEach(art =>{
                let a :ArtikelMengeDTO = new ArtikelMengeDTO();
                a.artikelId = art.artikelId;
                a.menge = art.bestand;
                a.palete = PALETTENTYP.EU;
                artikels.push(a);
            });
        for(let i = 0; i< artikels.length; i++){
            await this.getPlatzFurArtikel(artikels[i]);
        }
      
        
    }
    async getStellpletze(){
        try{
      //    await  this.genereLagaPlatze();
     //  await this.lagerArtikels();
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
          //  let lagerPlatze : LagerPlatzEntity[] = new Array();
            let volMenge : number[][] = new Array();
            let artikel :ArtikelDTO = new ArtikelDTO();
            let cont : number = 0;
            await this.artServ.getArtikel(artMen.artikelId).then(data => { Object.assign(artikel, data)});
            if(isFinite(artikel.artikelId)){

            
            volMenge = await this.helper.getPaletenVolumen(artikel.bestand, artikel.grosse, artikel.minLosMenge, 205);
           
            let neue: boolean = true;
            await  this.repo.findOneBy({'artId':artikel.artikelId}).then(data=>{
              if(data && data.artId !== null)  neue = false;  
             
           }, err=>{ console.log( err)});
           for(let i = 0; i < volMenge.length; i++){
          
           if(neue){
           //neue artikel es sollte erte position sein mit kleinste menge
          return await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true , 'lagerPlatzVolumen': true, 'static':true,'palettenTyp':true}, where: {'artId': IsNull(), 
              'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static': true}, order:{'lagerPlatzVolumen': 'ASC'}});//.then(data=>{
 
           }else{
            if(artMen.palete !== PALETTENTYP.KEINPALETTE){
            return await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true, 'palettenTyp':true}, where: {'artId': IsNull(), 
              'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static':false}, order:{'lagerPlatzVolumen': 'ASC'}});//.then(data=>{
               
               
            }else{
                let tmp : LagerPlatzEntity = new LagerPlatzEntity();
              
                tmp = await this.repo.findOneBy({'artId': artMen.artikelId, 'static': true});
                console.log(' laczna objetosc '+ this.helper.getVolumenNeueUndAlt(artikel, artMen) + ' lagerplazt vol '+ tmp.lagerPlatzVolumen)
                if(this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                artMen.mhd === undefined || this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                artMen.mhd === tmp.mhd ){
                   console.log(tmp);
                 return tmp;
                }else{
                   return  await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true, 'palettenTyp': true}, where: {'artId': IsNull(), 
                    'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static':true}, order:{'lagerPlatzVolumen': 'ASC'}});
                }
              

            }
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
           let lagerPlatze : LagerPlatzEntity[] = new Array();
            let volMenge : number[][] = new Array();
            let artikel :ArtikelDTO = new ArtikelDTO();
            let cont : number = 0;
            await this.artServ.getArtikel(artMen.artikelId).then(data => { Object.assign(artikel, data)});
            if(isFinite(artikel.artikelId)){

            
            volMenge = await this.helper.getPaletenVolumen(artikel.bestand, artikel.grosse, artikel.minLosMenge, 205);
           
            //let neue: boolean = true;
           // await  this.repo.findOneBy({'artId':artikel.artikelId}).then(data=>{
             // if(data && data.artId !== null)  neue = false;  
             
           //}, err=>{ console.log( err)});
           for(let i = 0; i < volMenge.length; i++){
           
            //if(neue){
             if(i === 0){
            let tmps =  await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true , 'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
               'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static': true}, order:{'lagerPlatzVolumen': 'ASC'}});//.then(data=>{
                 tmps.artId = artikel.artikelId;
                 tmps.artikelMenge = volMenge[i][1];
                 tmps.mhd = this.helper.getRandomMhd();
                 tmps.einheit = artikel.basisEinheit;
                 tmps.palettenTyp = PALETTENTYP.EU;
                await this.repo.save(tmps);
                 cont++;
                   lagerPlatze.push(  tmps);
              
            }else{
             if(artMen.palete !== PALETTENTYP.KEINPALETTE){
           let tmps =  await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
               'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static':false}, order:{'lagerPlatzVolumen': 'ASC'}});//.then(data=>{
                 tmps.artId = artikel.artikelId;
                 tmps.artikelMenge = volMenge[i][1];
                 tmps.mhd = this.helper.getRandomMhd();
                 tmps.einheit = artikel.basisEinheit;
                 tmps.palettenTyp = PALETTENTYP.EU;
               await  this.repo.save(tmps);
                 lagerPlatze.push( tmps);
                 cont++;
            
             }else{
                 let tmp : LagerPlatzEntity = new LagerPlatzEntity();
               
                 tmp = await this.repo.findOneBy({'artId': artMen.artikelId, 'static': true});
                 if(this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                 artMen.mhd === undefined || this.helper.getVolumenNeueUndAlt(artikel, artMen) < tmp.lagerPlatzVolumen &&
                 artMen.mhd === tmp.mhd ){
                   lagerPlatze.push( tmp);
                 }else{
                       await this.repo.findOne({select: {'id':true, 'lagerplatz': true,'artId': true, 'artikelMenge':true ,'lagerPlatzVolumen': true, 'static':true}, where: {'artId': IsNull(), 
                     'lagerPlatzVolumen': MoreThanOrEqual(volMenge[i][0]), 'static':true}, order:{'lagerPlatzVolumen': 'ASC'}}).then(data=>{
                        lagerPlatze.push( data);
                     }, err=>{
                         console.log(err);
                       //  return err;
                     });
                 }
               
 
             }
            }
         }
     }
     console.log('volmenge '+ JSON.stringify( volMenge) + ' artikel '+artikel.artikelId  + ' cont '+cont  );
    // await this.repo.create(lagerPlatze);
    // await this.repo.save(lagerPlatze);
    //await console.log(JSON.stringify(lagerPlatze));
         return  new LagerPlatzEntity();
         }catch( err){
             throw new Error(" Cant find lagerplatz fur artikel " + err);
             
         }
       
    }*/
    //koniec generatora
  
}
