import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { registerUserDTO } from 'src/DTO/registerUserDTO';
import { ROLE, userEntity } from 'src/entity/userEntity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(userEntity) private repo: Repository<userEntity>, 
    private jwt : JwtService){}

    async registerUser(regDTO : registerUserDTO){
        const {username, password} = regDTO;
       
        const hashed = await bcrypt.hash(password, 12);
        const salt = await bcrypt.getSalt(hashed);
        const user : userEntity = new userEntity();
        user.username = username;
        user.userpassword = hashed;
        user.salt = salt;
        user.role = ROLE.KOMMISIONIER;
        this.repo.create(user);
        try{
           return await this.repo.save(user);
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen, registration process wurde abgebrochen' + err);
        }
        
    }
    async loginUser(logDTO : registerUserDTO){
        const {username, password} = logDTO;
        const user = await this.repo.findOneBy({username});
        if(!user){
            throw new UnauthorizedException('Falsche Eingaben');
        }
        const role = user.role;
        const id = user.id;
        const isPasswordMatch = await bcrypt.compare(password, user.userpassword);
        if(isPasswordMatch){
            const jwtPayload : {username : string, role : string, id : number } = {username, role, id};
            const jwtToken = await this.jwt.signAsync(jwtPayload, {expiresIn: '1d', algorithm: 'HS512'});
           
            return {token : jwtToken};
        }else{
            throw new UnauthorizedException('Falsche Eingaben');
        }
        
    }

}
