import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from 'src/entity/userEntity';
import {PassportModule} from '@nestjs/passport';
import { jwtCustomStrategy } from './jwtCustomStrategy';


@Module({
  imports: [TypeOrmModule.forFeature([userEntity]),
  JwtModule.register(
    {secret:  'asgd1208230AHJGksjd()/aslkdj',
    signOptions: 
      {
      algorithm: 'HS512',
      expiresIn: '1d'
      }
    }
    ),
  PassportModule.register({
    defaultStrategy: 'jwt'
  })],
  providers: [AuthService, jwtCustomStrategy],
  controllers: [AuthController],
  exports: [PassportModule, jwtCustomStrategy]
})
export class AuthModule {}
