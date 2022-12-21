import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InKomissPalletenEntity } from 'src/entity/InKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { KomissionierController } from './komissionier.controller';
import { KommissionierService } from './komissionier.service';

@Module({
  imports: [TypeOrmModule.forFeature([KommissionirungEntity, KommisioDetailsEntity, InKomissPalletenEntity]), AuthModule],
  controllers: [KomissionierController],
  providers: [KommissionierService]
})
export class KomissionierModule {}
