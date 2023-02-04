import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VorschalgDTO } from 'src/DTO/vorschlagDTO';
import { VorschlagEntity } from 'src/entity/vorschlagEntitiy';
import { Repository } from 'typeorm';

@Injectable()
export class VorschlagService {
    constructor(@InjectRepository(VorschlagEntity) private repo: Repository<VorschlagEntity>) {}

    async getVorschlags(): Promise<VorschlagEntity[]> { 
        try {
            return await this.repo.find({select: {
                'id': true,
                'name': true,
                'erledigt': true,
            }}).catch(() => {
                throw new HttpException('Ich hab kein vorschlage gefunden', HttpStatus.NOT_FOUND);
            });
        } catch (err) {
            return err;
        }
    }
    async getVorschlagById(vorid: number) { 
        try {
            return await this.repo.findOne({where: { 'id': vorid}}).catch(() => {
                throw new HttpException('Ich hab vorschlag mit nr ' + vorid + ' nicht  gefunden', HttpStatus.NOT_FOUND);
            });
        } catch (err) {
            return err;
        }
    }
    async createVorschalg(vorschlag: VorschalgDTO) {
        try {
          const tmp: VorschlagEntity =  await this.repo.create(vorschlag);
            return await this.repo.save(tmp).then((data) => {
                if(data !== null) {
                    return data.id;
                }
                throw new HttpException('Vorschlag konnte nicht gespeichert werden!', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (err) {
            return err;
        }
    }
    async deleteVorschlag(vorschlagId: number) {
        try {
            return await this.repo.delete({id: vorschlagId}).then((data) => {
                if(data.affected === 1) {
                    return data.affected;
                }
                throw new HttpException('ich konnte das Vorschlad id: ' + vorschlagId + ' nicht löschen', HttpStatus.INTERNAL_SERVER_ERROR);
            });
        } catch (err) {
            return err;
        }
    }
}
