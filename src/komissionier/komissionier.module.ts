import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';
import { KomissionierController } from './komissionier.controller';
import { KommissionierService } from './komissionier.service';

@Module({
  imports: [TypeOrmModule.forFeature([KommissionirungEntity, KommisioDetailsEntity, InKomissPalletenEntity]), AuthModule],
  controllers: [KomissionierController],
  providers: [KommissionierService]
})
export class KomissionierModule {}
