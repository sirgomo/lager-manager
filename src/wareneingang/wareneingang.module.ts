import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtService } from 'src/artikel/art.service';
import { UidService } from 'src/artikel/uid/uid.service';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { LagerPlatzEntity } from 'src/entity/lagerPlatzEntity';
import { UiidEntity } from 'src/entity/uiidEntity';
import { WarenEingangEntity } from 'src/entity/warenEingangEntity';
import { LagerService } from 'src/lager/lager.service';
import { WareneingangController } from './wareneingang.controller';
import { WareneingangService } from './wareneingang.service';

@Module({
  imports: [TypeOrmModule.forFeature([WarenEingangEntity, LagerPlatzEntity, ArtikelEntity, UiidEntity]), AuthModule, ],
  controllers: [WareneingangController],
  providers: [WareneingangService, LagerService,  ArtService, UidService]
})
export class WareneingangModule {}
