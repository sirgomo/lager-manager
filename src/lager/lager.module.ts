import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { LagerController } from './lager.controller';
import { LagerService } from './lager.service';

@Module({
  imports: [TypeOrmModule.forFeature([LagerPlatzEntity]), AuthModule],
  controllers: [LagerController],
  providers: [LagerService]
})
export class LagerModule {}
