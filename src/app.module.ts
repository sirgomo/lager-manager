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
import { ArtikelEntity } from './entity/artikelEntity';
import { ArtikelModule } from './artikel/artikel.module';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './entity/userEntity';
import { RoleGuard } from './auth/roleGuard';
import { InKomissPalletenEntity } from './entity/inKomissPalletenEntity';
import { KommissionirungEntity } from './entity/kommissionirungEntity';
import { LagerPlatzEntity } from './entity/lagerPlatzEntity';
import { PalettenEnttity } from './entity/palettenEntity';
import { WarenEingangEntity } from './entity/warenEingangEntity';
import { KommisioDetailsEntity } from './entity/kommisioDetailsEntity';
import { SpeditionModule } from './spedition/spedition.module';
import { UiidEntity } from './entity/uiidEntity';
import { WarenEingStat } from './entity/warenEingStat';
import { WarenAusgStat } from './entity/warenAusgStat';
import { EinkaufModule } from './einkauf/einkauf.module';
import { AdminModule } from './admin/admin.module';
import { KreditorsEntity } from './entity/kreditorsEntity';
import { UserModule } from './user/user.module';
import { WarenKontrolleModule } from './waren-kontrolle/waren-kontrolle.module';
import { VorschlagEntity } from './entity/vorschlagEntitiy';
import { FehlendArtikelEntity } from './entity/fehlendArtikelEntity';
import { WarenBestellungEntity } from './entity/warenBestellungEntity';
import { SpeditionEntity } from './entity/speditionEntity';
import { VorschlagModule } from './vorschlag/vorschlag.module';
import { FirmSettingsEntity } from './entity/firmSettingsEntity';
import { FirmsettingsModule } from './firmsettings/firmsettings.module';
import { WareausgangModule } from './wareausgang/wareausgang.module';
import { env } from './env/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.ip,
      port: env.port,
      username: env.user,
      password: env.pass,
      database: env.base,
      entities: [
        DispositorEntity,
        ArtikelEntity,
        UserEntity,
        FehlendArtikelEntity,
        InKomissPalletenEntity,
        KommissionirungEntity,
        LagerPlatzEntity,
        PalettenEnttity,
        SpeditionEntity,
        WarenBestellungEntity,
        WarenEingangEntity,
        KommisioDetailsEntity,
        UiidEntity,
        WarenEingStat,
        WarenAusgStat,
        KreditorsEntity,
        VorschlagEntity,
        FirmSettingsEntity,
      ],
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
    UserModule,
    WarenKontrolleModule,
    VorschlagModule,
    FirmsettingsModule,
    WareausgangModule,
  ],
  controllers: [AppController],
  providers: [RoleGuard],
})
export class AppModule {}
