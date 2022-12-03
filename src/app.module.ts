import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WareneingangModule } from './wareneingang/wareneingang.module';
import { KomissionierModule } from './komissionier/komissionier.module';
import { LagerModule } from './lager/lager.module';
import { WarenbuchungModule } from './warenbuchung/warenbuchung.module';
import { DispositorsModule } from './dispositors/dispositors.module';
import { VerkaufModule } from './verkauf/verkauf.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispositorEntity } from './entity/dispositorEntity';
import { ArtikelEntity } from './entity/ArtikelEntity';
import { ArtikelModule } from './artikel/artikel.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './entity/UserEntity';
import { RoleGuard } from './auth/RoleGuard';
import { ArtikelReservationEntity } from './entity/ArtikelReservationEntity';
import { FehlendArtikelEntity } from './entity/FehlendArtikelEntity';
import { InKomissPalletenEntity } from './entity/InKomissPalletenEntity';
import { KommissionirungEntity } from './entity/KommissionirungEntity';
import { LagerPlatzEntity } from './entity/LagerPlatzEntity';
import { PalettenEnttity } from './entity/palettenEntity';
import { SpeditionEntity } from './entity/SpeditionEntity';
import { WarenBestellungEntity } from './entity/WarenBestellungEntity';
import { WarenEingangEntity } from './entity/WarenEingangEntity';
import { KommisioDetailsEntity } from './entity/KommisioDetailsEntity';
import { SpeditionModule } from './spedition/spedition.module';
import { UiidEntity } from './entity/UiidEntity';
import { WarenEingStat } from './entity/warenEingStat';
import { WarenAusgStat } from './entity/warenAusgStat';
import { EinkaufModule } from './einkauf/einkauf.module';
import { AdminModule } from './admin/admin.module';
import { KreditorsEntity } from './entity/kreditorsEntity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'beta1243',
      database: 'lager',
      entities: [DispositorEntity, ArtikelEntity, UserEntity, ArtikelReservationEntity, FehlendArtikelEntity, InKomissPalletenEntity, KommissionirungEntity,
      LagerPlatzEntity, PalettenEnttity, SpeditionEntity, WarenBestellungEntity, WarenEingangEntity, KommisioDetailsEntity, UiidEntity, WarenEingStat, WarenAusgStat, KreditorsEntity],
      synchronize: false,
    }),
    WareneingangModule,
    KomissionierModule,
    LagerModule,
    WarenbuchungModule,
    DispositorsModule,
    VerkaufModule,
    ArtikelModule,
    AuthModule,
    SpeditionModule,
    EinkaufModule,
    AdminModule,
   
  ],
  controllers: [AppController],
  providers: [ RoleGuard],
})
export class AppModule {}
