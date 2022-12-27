import { Controller, UseGuards } from '@nestjs/common';
import { Get } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { ROLE } from 'src/entity/UserEntity';
import { WarenKontrolleService } from './waren-kontrolle.service';

@Controller('kontrolle')
@UseGuards(AuthGuard(), RoleGuard)
export class WarenKontrolleController {
  constructor(private service: WarenKontrolleService) {}
  @Get()
  @ROLES(ROLE.KONTROLLER)
  getKommissionierungen() {
    return this.service.getAllKommisionierungen();
  }
}
