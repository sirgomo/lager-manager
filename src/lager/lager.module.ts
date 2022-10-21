import { Module } from '@nestjs/common';
import { LagerController } from './lager.controller';
import { LagerService } from './lager.service';

@Module({
  controllers: [LagerController],
  providers: [LagerService]
})
export class LagerModule {}
