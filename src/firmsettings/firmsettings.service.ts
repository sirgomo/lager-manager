import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirmDataDTO } from 'src/DTO/firmDataDTO';
import { FirmSettingsEntity } from 'src/entity/firmSettingsEntity';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class FirmsettingsService {
    constructor(@InjectRepository(FirmSettingsEntity) private repo: Repository<FirmSettingsEntity>) {}
    async getFirm() {
        try {
            const tmpEntity : FirmSettingsEntity = 
          await this.repo.findOne({where: {id: Not(IsNull())}});
        
          if(tmpEntity === null) {
            throw new HttpException('Nicht gefunden!', HttpStatus.NOT_FOUND);
          }
          return tmpEntity;
        } catch (err) {
            if(err.message === "Table 'lager.firmsettings' doesn't exist") {
               this.createFirm();
            }
            console.log(err);
            return err;
        }
    }
    async createFirm() {
        const tmpEntity: FirmSettingsEntity = new FirmSettingsEntity();
        await this.repo.query(`CREATE TABLE IF NOT EXISTS firmSettings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            rfirmname VARCHAR(255) NOT NULL,
            rname VARCHAR(255),
            rstrasse VARCHAR(255) NOT NULL,
            rhausnr SMALLINT NOT NULL,
            rstadt VARCHAR(255) NOT NULL,
            rpostleitzahl MEDIUMINT NOT NULL,
            lfirmname VARCHAR(255),
            lname VARCHAR(255),
            lstrasse VARCHAR(255),
            lhausnr SMALLINT,
            lstadt VARCHAR(255),
            lpostleitzahl MEDIUMINT,
            steuernummer VARCHAR(20) NOT NULL,
            steuerid VARCHAR(20),
            ustid VARCHAR(20) 
        )`).then((data) => {
            console.log(data);
        }, (err) => {
            console.log(err);
        })
    }
    async saveFirmDaten(data: FirmDataDTO) {
        try {
            const tmp: FirmSettingsEntity = await this.repo.create(data);
            return await (await this.repo.save(tmp)).id; 
        } catch (err) {
            return err;
        }
    }
    async updateFirmDaten(data: FirmDataDTO) {
        try {
            const tmp: FirmSettingsEntity = await this.repo.create(data);
            return await (await this.repo.update({id: tmp.id}, tmp)).affected;
        } catch (err) {
            return err;
        }
    }
}
