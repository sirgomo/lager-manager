import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { WarenEingArticleDTO } from 'src/DTO/warenEingArticleDTO';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { LagerService } from 'src/lager/lager.service';
import { Repository } from 'typeorm';

@Injectable()
export class WareneingangService {
    constructor(@InjectRepository(WarenEingangEntity) private serv :Repository<WarenEingangEntity>,
      private lagerSerr: LagerService){}

    async getAllBuchngen():Promise<WarenEingangEntity[]>{
        try{
            return await this.serv.find({where: {'eingebucht' : true, 'artikelsGebucht': true}}).then();
        }catch(err){
            throw new Error("Etwas ist schieff gegangen wenn ich versuchte buchungen zu finden");
            
        }
    }
    async getArtikels(bestellungid: number){
      let artikles : WarenEingArticleDTO[] = new Array();
       try{
         await this.serv.query(`SELECT wareneingang.bestellungId, wareneingang.artikelid, wareneingang.menge, artikel.name 
         FROM wareneingang LEFT JOIN artikel ON wareneingang.artikelid = artikel.artikelId WHERE wareneingang.bestellungid = '${bestellungid}' 
         AND wareneingang.artikelid IS NOT NULL`).then(
            data=>{
              data.forEach(art=>{
                if(art){
                    let tmp: WarenEingArticleDTO = new WarenEingArticleDTO();
                    Object.assign(tmp, art);
                    artikles.push(tmp);
                }
              });
            });
            return artikles;
       }catch(err){
        throw new Error("Etwas ist schieff genagen als ich veruchte Artikles zu holen" + err);
        
       }
      
    }
    async delArtikel(artikelid:number, bestellid: number){
       
        try{
            await this.serv.delete({'artikelid': artikelid, 'bestellungId': bestellid});
            await this.serv.findAndCountBy({'bestellungId':bestellid}).then(data=>{
                if(data[1] === 1){
                    this.serv.delete({'bestellungId':bestellid});
                }
            })
           
        }catch (err){
            throw new Error('Etwas ist schieff, kann nicht eingegeben artikel löschen');
        }
    }
    async getPlatz(art: ArtikelMengeDTO){
        return await this.lagerSerr.getPlatzFurArtikel(art);
    }
    async lageEs(art: LagerPlatztDTO){
        return await this.lagerSerr.createLagerPlatz(art);
    }
    async updateArtikel(art: WarenEingArticleDTO){
        try{
          return await this.serv.findOneBy({'artikelid': art.artikelid, 'bestellungId': art.bestellungId}).then(
                data=>{
                    data.menge -= art.menge;
                    this.serv.save(data);
                    return data;
                }
            );
        }catch(err){
            throw new Error("Etwas ist schieff gegangen, ich kann der artikel nicht ändern");
            
        }
    }
}
