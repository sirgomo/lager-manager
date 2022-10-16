import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { artikelEntity } from 'src/entity/artikelEntity';
import { ArtcontrollerController } from './artcontroller/artcontroller.controller';
import { ArtserviceService } from './artservice/artservice.service';


@Module({
  imports: [TypeOrmModule.forFeature([artikelEntity])],
  controllers: [ArtcontrollerController],
  providers: [ArtserviceService]
})
export class ArtikelModule {}
