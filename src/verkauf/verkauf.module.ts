import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { UidService } from 'src/artikel/uid/uid.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/ArtikelEntity';
import { ArtikelReservationEntity } from 'src/entity/ArtikelReservationEntity';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
import { LagerService } from 'src/lager/lager.service';
import { VerkaufController } from './verkauf.controller';
import { VerkaufService } from './verkauf.service';

@Module({
  imports: [TypeOrmModule.forFeature([KommisioDetailsEntity, KommissionirungEntity, LagerPlatzEntity, ArtikelEntity, UiidEntity, ArtikelReservationEntity]), AuthModule],
  controllers: [VerkaufController],
  providers: [VerkaufService, LagerService, ArtService, UidService]
})
export class VerkaufModule {}
