import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { artikelEntity } from 'src/entity/artikelEntity';
import { uiidEntity } from 'src/entity/uiidEntity';
import { artController } from './art.controller';
import { artService } from './art.service';
import { UidService } from './uid/uid.service';


@Module({
  imports: [TypeOrmModule.forFeature([artikelEntity, uiidEntity]), AuthModule],
  controllers: [artController],
  providers: [artService, UidService]
})
export class ArtikelModule {}
