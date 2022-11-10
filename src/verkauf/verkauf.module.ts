import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { VerkaufController } from './verkauf.controller';
import { VerkaufService } from './verkauf.service';

@Module({
  imports: [TypeOrmModule.forFeature([KommisioDetailsEntity, KommissionirungEntity]), AuthModule],
  controllers: [VerkaufController],
  providers: [VerkaufService]
})
export class VerkaufModule {}
