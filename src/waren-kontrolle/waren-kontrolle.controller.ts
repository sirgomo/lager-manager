import { Controller, UseGuards } from '@nestjs/common';
import { Get, Param } from '@nestjs/common/decorators';
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
  @Get(':id')
  @ROLES(ROLE.KONTROLLER)
  getKommByNr(@Param('id') id: number) {
    return this.service.getKommById(id);
  }
  @Get('palette/:id')
  @ROLES(ROLE.KONTROLLER)
  getPalatenbyKomId(@Param('id') kommid: number) {
    return this.service.getPaletenByKomissId(kommid);
  }
  @Get('kommissionier/:id')
  @ROLES(ROLE.KONTROLLER)
  getKommissionierByPalId(@Param('id') id: number) {
    return this.service.getKommissionier(id);
  }
}
