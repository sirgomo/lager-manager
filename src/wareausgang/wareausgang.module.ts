import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { WareausgangController } from './wareausgang.controller';
import { WareausgangService } from './wareausgang.service';

@Module({
  imports: [TypeOrmModule.forFeature([KommisioDetailsEntity, KommissionirungEntity, InKomissPalletenEntity]), AuthModule],
  controllers: [WareausgangController],
  providers: [WareausgangService]
})
export class WareausgangModule {}
