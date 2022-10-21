import { Module } from '@nestjs/common';
import { VerkaufController } from './verkauf.controller';
import { VerkaufService } from './verkauf.service';

@Module({
  controllers: [VerkaufController],
  providers: [VerkaufService]
})
export class VerkaufModule {}
