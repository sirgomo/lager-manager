import { Module } from '@nestjs/common';
import { WarenKontrolleService } from './waren-kontrolle.service';
import { WarenKontrolleController } from './waren-kontrolle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { InKomissPalletenEntity } from 'src/entity/inKomissPalletenEntity';
import { KommisioDetailsEntity } from 'src/entity/kommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/kommissionirungEntity';

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
