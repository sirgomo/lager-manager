import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BestArtikelMengeDTO } from 'src/DTO/bestArtikelMengeDTO';
import { WarenBuchungDto } from 'src/DTO/warenBuchungDTO';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { WarenEingStat } from 'src/entity/warenEingStat';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class WarenbuchungService {
   
    constructor(@InjectRepository(WarenEingangEntity) private repo: Repository<WarenEingangEntity>, 
    @InjectRepository(ArtikelEntity) private artRepo: Repository<ArtikelEntity>,
    @InjectRepository(WarenEingStat) private repoStat : Repository<WarenEingStat>){
       }

  async  createBuchung(buch :WarenBuchungDto):Promise<WarenBuchungDto>{
        try{
            if(buch.artikelsGebucht === null){
                buch.artikelsGebucht = false;
            }
          await  this.repo.create(buch);
          if(buch.eingebucht && !buch.artikelsGebucht){
         if( await this.updateArtikels(buch)){
            buch.artikelsGebucht = true;
         }
        
          }
        return  await  this.repo.save(buch);
        }catch(err){
            console.log(err);
            return err;
        }
    }
    async updateArtikels(buch: WarenEingangEntity):Promise<boolean>{
        let ret :boolean = false;
        if(buch.eingebucht && !buch.artikelsGebucht){
            let buchungenFertig : WarenEingangEntity[] = new Array();
          buchungenFertig =   await this.repo.find({where: { 'bestellungId': buch.bestellungId, 'artikelid': Not(IsNull())}});
          if(buchungenFertig.length > 0){
            for(let i = 0; i < buchungenFertig.length; i++){
                await this.artRepo.findOneBy({'artikelId': buchungenFertig[i].artikelid}).then(data=>{
                    let eingStat : WarenEingStat = new WarenEingStat();
                    eingStat.artikelId = data.artikelId;
                    eingStat.eingangDatum = new Date(Date.now());
                    eingStat.menge = buchungenFertig[i].menge;
                    eingStat.price = data.artikelPrice;
                    eingStat.verPrice = data.verPrice;
                    this.repoStat.save(eingStat);
                    data.bestand += buchungenFertig[i].menge;
                    this.artRepo.save(data);
                   
                    ret = true;
                }, err=>{
                    return ret;
                    //nicht dum save errors tu database, to vewrfolgung mögliche problemen!
                });
            }
          }
          }
          return ret;
    }
  async  addArtikel(best: BestArtikelMengeDTO){
        try{
            let buch : WarenBuchungDto = new WarenBuchungDto(); 
        await     this.repo.findOneBy({'bestellungId': best.bestellungId}).then(
                data => {
                    if(buch.eingebucht === true){
                        throw new Error("Diese buchung ist schon eingebucht! Du kannst kein artikel mehr zugeben!");
                    }
                    buch = data;
                },  err => {
                    return err;
                }
             );
             buch.id = null;
             buch.artikelid = best.artikelId;
             buch.menge = best.menge;
        await     this.repo.create(buch);
      return  await     this.repo.save(buch);
       
        }catch(err){
            return err;
        }
    }
   async deleteArtikel(artid: number, bestid:number){
    try{
    
      return  await this.repo.delete({'artikelid': artid, 'bestellungId': bestid});
    }catch (err){
        return err;
    }
   
    }
    async getAllArticles(bestellungsid: number){
        try{
            let be : BestArtikelMengeDTO[] = new Array();
        await this.repo.findBy({'bestellungId': bestellungsid, 'artikelid': Not(IsNull())})
        .then(datas => {
            datas.forEach(data =>{
                let a : BestArtikelMengeDTO = new BestArtikelMengeDTO();
                a.artikelId = data.artikelid
                a.bestellungId = data.bestellungId;
                a.menge = data.menge;
                be.push(a);
              });
        }, error =>{
            console.log('leider error als ich versuchte artikels zu holen ');
        });
      
        return be;
        }catch(err){
           
            return err;
        }
    }
    async deletBuchung(id:number){
        try{
         return await this.repo.delete({'bestellungId' : id});
        }catch(err){
            return err;
        }
    }
    async getBuchungen(){
       
        try{
            
            let tmp = await this.repo.findBy({'artikelid': IsNull()});
            let buchArr : WarenBuchungDto[] = new Array();
            if(tmp.length > 0){
               
                tmp.forEach(dat =>{
                    buchArr.push(dat);
                });
            }
            return buchArr;
        }catch(err){
            return err;
        }
        
    }
}
