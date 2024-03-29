import { Module } from '@nestjs/common';
import { WarenbuchungService } from './warenbuchung.service';
import { WarenbuchungController } from './warenbuchung.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarenEingangEntity } from 'src/entity/warenEingangEntity';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { ArtService } from 'src/artikel/art.service';
import { UidService } from 'src/artikel/uid/uid.service';
import { UiidEntity } from 'src/entity/uiidEntity';
import { WarenEingStat } from 'src/entity/warenEingStat';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WarenEingangEntity,
      ArtikelEntity,
      UiidEntity,
      WarenEingStat,
    ]),
    AuthModule,
  ],
  providers: [WarenbuchungService, ArtService, UidService],
  controllers: [WarenbuchungController],
})
export class WarenbuchungModule {}
