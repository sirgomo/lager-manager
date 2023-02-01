import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { UidService } from 'src/artikel/uid/uid.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { LagerPlatzEntity } from 'src/entity/lagerPlatzEntity';
import { UiidEntity } from 'src/entity/uiidEntity';
import { LagerService } from 'src/lager/lager.service';
import { VerkaufController } from './verkauf.controller';
import { VerkaufService } from './verkauf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KommisioDetailsEntity,
      KommissionirungEntity,
      LagerPlatzEntity,
      ArtikelEntity,
      UiidEntity,
    ]),
    AuthModule,
  ],
  controllers: [VerkaufController],
  providers: [VerkaufService, LagerService, ArtService, UidService],
})
export class VerkaufModule {}
