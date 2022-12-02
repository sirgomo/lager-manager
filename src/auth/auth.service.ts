import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegiUserDTO } from 'src/DTO/regiUserDTO';
import { ROLE, UserEntity } from 'src/entity/UserEntity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import {JwtService} from '@nestjs/jwt';
import { UserLogDTO } from 'src/DTO/userLogDTO';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private repo: Repository<UserEntity>, 
    private jwt : JwtService){}

    async registerUser(regDTO : RegiUserDTO){
        const {username, userpassword} = regDTO;
       
        const hashed = await bcrypt.hash(userpassword, 12);
        const salt = await bcrypt.getSalt(hashed);
        const user : UserEntity = new UserEntity();
        user.username = username;
        user.userpassword = hashed;
        user.salt = salt;
        user.role = ROLE.WARENEINGANG;
        this.repo.create(user);
        try{
           return await this.repo.save(user);
        }catch(err){
            throw new InternalServerErrorException('Etwas is schief gegangen, registration process wurde abgebrochen' + err);
        }
        
    }
    async loginUser(logDTO : UserLogDTO){
        let users:number = await (await this.repo.findAndCount())[1];
        if(users === 0){
            this.repo.query(`insert INTO users (vorname, nachname, username, userpassword, salt, role) VALUES ('wlodek', 'hocimek', 'wlodek', '$2a$12$sG1BNLo.8x7z76.wuS09pO9L7.9pG.GxKOU8aqLGz1hC71.l3hOKq', '$2a$12$sG1BNLo.8x7z76.wuS09pO', 'ADMIN')`);
        }
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
