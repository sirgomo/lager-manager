import { Module } from '@nestjs/common';
import { WarenKontrolleService } from './waren-kontrolle.service';
import { WarenKontrolleController } from './waren-kontrolle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InKomissPalletenEntity } from 'src/entity/InKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InKomissPalletenEntity,
      KommisioDetailsEntity,
      KommissionirungEntity,
    ]),
    AuthModule,
  ],
  providers: [WarenKontrolleService],
  controllers: [WarenKontrolleController],
})
export class WarenKontrolleModule {}
