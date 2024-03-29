import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ArtikelEntity } from 'src/entity/artikelEntity';
import { UiidEntity } from 'src/entity/uiidEntity';
import { ArtController } from './art.controller';
import { ArtService } from './art.service';
import { UidService } from './uid/uid.service';


@Module({
  imports: [TypeOrmModule.forFeature([ArtikelEntity, UiidEntity]), AuthModule],
  controllers: [ArtController],
  providers: [ArtService, UidService]
})
export class ArtikelModule {}
