import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { artikelEntity } from 'src/entity/artikelEntity';
import { artController } from './art.controller';
import { artService } from './art.service';


@Module({
  imports: [TypeOrmModule.forFeature([artikelEntity]), AuthModule],
  controllers: [artController],
  providers: [artService]
})
export class ArtikelModule {}
