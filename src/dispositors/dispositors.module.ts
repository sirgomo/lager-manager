import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dispoEntity } from 'src/entity/dispoEntity';
import { DisControllerController } from './dis-controller/dis-controller.controller';
import { DisServiceService } from './dis-service/dis-service.service';

@Module({
  imports: [TypeOrmModule.forFeature([dispoEntity])],
  controllers: [DisControllerController],
  providers: [DisServiceService], 
})
export class DispositorsModule {}
