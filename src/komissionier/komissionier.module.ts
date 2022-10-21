import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { kommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { kommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { KomissionierController } from './komissionier.controller';
import { KommissionierService } from './komissionier.service';

@Module({
  imports: [TypeOrmModule.forFeature([kommissionirungEntity, kommisioDetailsEntity]), AuthModule],
  controllers: [KomissionierController],
  providers: [KommissionierService]
})
export class KomissionierModule {}
