import { Module } from '@nestjs/common';
import { WarenbuchungService } from './warenbuchung.service';
import { WarenbuchungController } from './warenbuchung.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarenEingangEntity } from 'src/entity/WarenEingangEntity';
import { AuthModule } from 'src/auth/auth.module';
import { LagerPlatzGenerator } from 'src/lagerPlatzGen';


@Module({
  imports: [TypeOrmModule.forFeature([WarenEingangEntity]), AuthModule], 
  providers: [WarenbuchungService],
  controllers: [WarenbuchungController]
})
export class WarenbuchungModule {}
