import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDataDTO } from 'src/DTO/userDataDTO';
import { UserEntity } from 'src/entity/UserEntity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private repo : Repository<UserEntity>){

    }
    async getUserById(id:number):Promise<UserDataDTO>{
        try{
            let user :UserDataDTO = new UserDataDTO();
           return  await this.repo.findOneBy({'id': id}).then(data=>{
                if(data !== null){
                    user.id = data.id;
                    user.nachname = data.nachname;
                    user.role = data.role;
                    user.vorname = data.vorname;
                    user.username = data.username;
                    return user;
                }
             });
             
        }catch (err){
            throw new Error("Ich kann user nicht finden! " + err);
            
        }
    }
}
