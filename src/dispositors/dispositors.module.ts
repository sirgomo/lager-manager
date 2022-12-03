import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DispositorEntity } from 'src/entity/dispositorEntity';
import { DisControllerController } from './disController';
import { DisServiceService } from './disService';


@Module({
  imports: [TypeOrmModule.forFeature([DispositorEntity]), AuthModule],
  controllers: [DisControllerController],
  providers: [DisServiceService], 
})
export class DispositorsModule {}
