import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { VorschlagEntity } from 'src/entity/vorschlagEntitiy';
import { VorschlagController } from './vorschlag.controller';
import { VorschlagService } from './vorschlag.service';

@Module({
  imports: [TypeOrmModule.forFeature([VorschlagEntity]), AuthModule],
  controllers: [VorschlagController],
  providers: [VorschlagService]
})
export class VorschlagModule {
}
