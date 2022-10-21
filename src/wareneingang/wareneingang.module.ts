import { Module } from '@nestjs/common';
import { WareneingangController } from './wareneingang.controller';
import { WareneingangService } from './wareneingang.service';

@Module({
  controllers: [WareneingangController],
  providers: [WareneingangService]
})
export class WareneingangModule {}
