import {PassportStrategy} from '@nestjs/passport'
import {Strategy, ExtractJwt} from 'passport-jwt'
import {InjectRepository} from '@nestjs/typeorm'
import { UserEntity, ROLE } from 'src/entity/userEntity'
import { Repository } from 'typeorm'
import { Injectable, UnauthorizedException } from '@nestjs/common'
@Injectable()
export class JwtCustomStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(UserEntity) private repo : Repository<UserEntity>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:  'asgd1208230AHJGksjd()/aslkdj',
        })
    }
    async validate(payload : {username, ROLE, id}){
        const {username, ROLE, id} = payload;
        const user = await this.repo.findOneBy({id});
        if (!user){
            throw new UnauthorizedException('Kein unauthorized zugang');
        }
        return user;
    }
}