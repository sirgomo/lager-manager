import { Module } from '@nestjs/common';
import { FirmsettingsService } from './firmsettings.service';
import { FirmsettingsController } from './firmsettings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmSettingsEntity } from 'src/entity/firmSettingsEntity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [TypeOrmModule.forFeature([FirmSettingsEntity]), AuthModule ],
  providers: [FirmsettingsService],
  controllers: [FirmsettingsController]
})
export class FirmsettingsModule {}
