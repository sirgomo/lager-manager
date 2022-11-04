import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { UidService } from 'src/artikel/uid/uid.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
import { LagerController } from './lager.controller';
import { LagerService } from './lager.service';

@Module({
  imports: [TypeOrmModule.forFeature([LagerPlatzEntity, ArtikelEntity, UiidEntity]), AuthModule],
  controllers: [LagerController],
  providers: [LagerService, ArtService, UidService]
})
export class LagerModule {}
