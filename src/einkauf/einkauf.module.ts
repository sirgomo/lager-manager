import { Module } from '@nestjs/common';
import { EinkaufService } from './einkauf.service';
import { EinkaufController } from './einkauf.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { WarenBestellungEntity } from 'src/entity/warenBestellungEntity';

@Module({
  imports: [TypeOrmModule.forFeature([WarenBestellungEntity]), AuthModule],
  providers: [EinkaufService],
  controllers: [EinkaufController]
})
export class EinkaufModule {}
