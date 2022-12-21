import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtikelAufPaletteDTO } from 'src/DTO/artikelAufPaletteDTO';
import { DataFurKomissDTO } from 'src/DTO/dataFurKomissDTO';
import { NeuePaletteDTO } from 'src/DTO/neuePaletteDTO';
import { InKomissPalletenEntity } from 'src/entity/InKomissPalletenEntity';
import { ARTIKELSTATUS, KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { Helper } from 'src/helper';
import { Repository } from 'typeorm';

@Injectable()
export class KommissionierService {
    private helper :Helper = new Helper();
    constructor(@InjectRepository(KommissionirungEntity) private komm : Repository<KommissionirungEntity>, 
    @InjectRepository(KommisioDetailsEntity) private kommDet: Repository<KommisioDetailsEntity>, 
    @InjectRepository(InKomissPalletenEntity) private pal : Repository<InKomissPalletenEntity>){}

    async getKommissionierung(kommId : number):Promise<DataFurKomissDTO[]>{
        try{
            // lager platz, name, id, menge, komdetailid
          return  await this.kommDet.query(`SELECT artikelId, menge, kreditorId, platz, artname, minLos FROM kommDetails
            LEFT JOIN (SELECT artId,lagerplatz as platz,liferant FROM lagerplatz ) AS l ON  artikelId = l.artId AND kreditorId = l.liferant 
            LEFT JOIN (SELECT artikelId as aaid,name as artname,minLosMenge as minLos,liferantId FROM artikel) AS a ON artikelId = a.aaid  AND kreditorId = a.liferantId
            WHERE kommissId = '${kommId}' AND inBestellung = '0' AND gepackt = 'INPACKEN' ORDER BY platz ASC`).then(data=>{
                let tmpData : DataFurKomissDTO[] = new Array();
                Object.assign(tmpData, data);
                return tmpData;
            }, err=>{
                throw new Error('Kommissionierung nicht gefunden');
            });
        }catch (err){
            return err;
        }
    }
    async neuePalete(neuPal: NeuePaletteDTO):Promise<Number>{
        try{    
            let pal :InKomissPalletenEntity = new InKomissPalletenEntity();
            pal.id = this.helper.makePalId(4);
            pal.kommId = neuPal.kommId;
            pal.palettenTyp = neuPal.palTyp;
            pal.userId = neuPal.kommissionierId;
            return (await this.pal.save(pal)).id;
        }catch (err){
            return err;
        }
    }
    async gewichtErfassen(neuPal: NeuePaletteDTO):Promise<Number>{
        try{  
            //TODO es sollt geprüft werden ob realgewicht is fast die selber wie erwartete pallete gewicht
            return await this.pal.findOne({'where':{ 'id': neuPal.palid, 'artikelId' : 0, 'kommId': neuPal.kommId}}).then(data=>{
                data.paletteRealGewicht = neuPal.gewicht;
                this.pal.save(data);
                return data.paletteRealGewicht;
            })
        }catch (err){
            return err;
        }
    }
    async addAdrtikelToPalete(art : ArtikelAufPaletteDTO){}
    async getlastActiveKom(kommisionierId: number):Promise<string>{
        try{
           return await this.pal.findOne({where:{'userId': kommisionierId, 'paletteRealGewicht' : 0}}).then(data=>{
            return data.kommId + '/' + data.id;
           });
        }catch(err){
            return err;
        }
    }
    
}
