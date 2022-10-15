import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseProviderTs } from './database-provider.ts';
import { WareneingangModule } from './wareneingang/wareneingang.module';
import { KomissionierModule } from './komissionier/komissionier.module';
import { LagerModule } from './lager/lager.module';
import { WarenbuchungModule } from './warenbuchung/warenbuchung.module';
import { DispositorsModule } from './dispositors/dispositors.module';
import { VerkaufModule } from './verkauf/verkauf.module';
import { \src\dispositors\controllerController } from './src/dispositors/controller/src/dispositors/controller.controller';
import { \src\komissionier\controllerController } from './src/komissionier/controller/src/komissionier/controller.controller';
import { \src\lager\controllerController } from './src/lager/controller/src/lager/controller.controller';

@Module({
  imports: [WareneingangModule, KomissionierModule, LagerModule, WarenbuchungModule, DispositorsModule, VerkaufModule],
  controllers: [AppController, \src\dispositors\controllerController, \src\komissionier\controllerController, \src\lager\controllerController],
  providers: [AppService, DatabaseProviderTs],
})
export class AppModule {}
