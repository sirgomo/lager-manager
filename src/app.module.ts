import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WareneingangModule } from './wareneingang/wareneingang.module';
import { KomissionierModule } from './komissionier/komissionier.module';
import { LagerModule } from './lager/lager.module';
import { WarenbuchungModule } from './warenbuchung/warenbuchung.module';
import { DispositorsModule } from './dispositors/dispositors.module';
import { VerkaufModule } from './verkauf/verkauf.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dispoEntity } from './entity/dispoEntity';
import { artikelEntity } from './entity/artikelEntity';
import { ArtikelModule } from './artikel/artikel.module';
import { AuthModule } from './auth/auth.module';
import { userEntity } from './entity/userEntity';
import { RoleGuard } from './auth/RoleGuard';
import { artikelReservationEntity } from './entity/artikelReservationEntity';
import { fehlendArtikelEntity } from './entity/fehlendArtikelEntity';
import { inKomissPalletenEntity } from './entity/inKomissPalletenEntity';
import { komissionirunEntity } from './entity/komissionirungEntity';
import { lagerPlatzEntity } from './entity/lagerPlatzEntity';
import { palettenEnttity } from './entity/palettenEntity';
import { speditionEntity } from './entity/speditionEntity';
import { warenBestellungEntity } from './entity/warenBestellungEntity';
import { warenEingangEntity } from './entity/warenEingangEntity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'beta1243',
      database: 'lager',
      entities: [dispoEntity, artikelEntity, userEntity, artikelReservationEntity, fehlendArtikelEntity, inKomissPalletenEntity, komissionirunEntity,
      lagerPlatzEntity, palettenEnttity, speditionEntity, warenBestellungEntity, warenEingangEntity],
      synchronize: true,
    }),
    WareneingangModule,
    KomissionierModule,
    LagerModule,
    WarenbuchungModule,
    DispositorsModule,
    VerkaufModule,
    ArtikelModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, RoleGuard],
})
export class AppModule {}
