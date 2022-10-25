import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/UserEntity';
import {PassportModule} from '@nestjs/passport';
import { JwtCustomStrategy } from './JwtCustomStrategy';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
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
  providers: [AuthService, JwtCustomStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtCustomStrategy]
})
export class AuthModule {}
