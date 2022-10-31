import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BestArtikelMengeDTO } from 'src/DTO/bestArtikelMengeDTO';
import { WarenBuchungDto } from 'src/DTO/warenBuchungDTO';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class WarenbuchungService {
    constructor(@InjectRepository(WarenEingangEntity) private repo: Repository<WarenEingangEntity>){}

  async  createBuchung(buch :WarenBuchungDto):Promise<WarenBuchungDto>{
        try{
           
          await  this.repo.create(buch);
        return  await  this.repo.save(buch);
        }catch(err){
            console.log(err);
            return err;
        }
    }
  async  addArtikel(best: BestArtikelMengeDTO){
        try{
            let buch : WarenBuchungDto = new WarenBuchungDto(); 
        await     this.repo.findOneBy({'bestellungId': best.bestellungId}).then(
                data => {
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
   async deleteArtikel(id: number){
    try{
      return  await   this.repo.delete({'id': id});
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
            console.log('niestety error ');
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
