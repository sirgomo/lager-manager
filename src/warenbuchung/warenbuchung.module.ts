import { Module } from '@nestjs/common';
import { WarenbuchungService } from './warenbuchung.service';
import { WarenbuchungController } from './warenbuchung.controller';

@Module({
  providers: [WarenbuchungService],
  controllers: [WarenbuchungController]
})
export class WarenbuchungModule {}
