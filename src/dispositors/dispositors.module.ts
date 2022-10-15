import { Module } from '@nestjs/common';
import { \dispositors\controllerController } from './controller/dispositors/controller.controller';
import { ControllerController } from './controller/controller.controller';
import { ServiceService } from './service/service.service';

@Module({
  controllers: [\dispositors\controllerController, ControllerController],
  providers: [ServiceService]
})
export class DispositorsModule {}
