import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SpeditionEntity } from 'src/entity/speditionEntity';
import { SpeditionController } from './spedition.controller';
import { SpeditionService } from './spedition.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpeditionEntity]), AuthModule],
  controllers: [SpeditionController],
  providers: [SpeditionService]
})
export class SpeditionModule {}
