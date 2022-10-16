import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dispoEntity } from 'src/entity/dispoEntity';
import { DisControllerController } from './disController';
import { DisServiceService } from './disService';

@Module({
  imports: [TypeOrmModule.forFeature([dispoEntity])],
  controllers: [DisControllerController],
  providers: [DisServiceService], 
})
export class DispositorsModule {}
