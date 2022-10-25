import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { DispoEntity } from 'src/entity/DispoEntity';
import { DisControllerController } from './disController';
import { DisServiceService } from './disService';


@Module({
  imports: [TypeOrmModule.forFeature([DispoEntity]), AuthModule],
  controllers: [DisControllerController],
  providers: [DisServiceService], 
})
export class DispositorsModule {}
