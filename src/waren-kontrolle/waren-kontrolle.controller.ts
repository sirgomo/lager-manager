import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { Get, Param } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard'
import { ROLE } from 'src/entity/userEntity';
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
  @Patch('komm/:id')
  @ROLES(ROLE.KONTROLLER)
  setKommStatus(@Body() body: any, @Param('id') kommid: number) {
    return this.service.setNewStatus(kommid, body);
  }
  @Get('contnr/:nr')
  @ROLES(ROLE.KONTROLLER)
  getPaleteByNrForControlle(@Param('nr') palnr: number) {
    return this.service.getPaleteByIdForControle(palnr);
  }

  @Get('art/:nr')
  @ROLES(ROLE.KONTROLLER)
  setArtikelControlret(@Param('nr') artnr: number) {
    return this.service.setWareControled(artnr);
  }
  @Patch('lkw/:pid/:lkwnr')
  @ROLES(ROLE.KONTROLLER)
  setLkwNr(@Param('pid') palid: number, @Param('lkwnr') lkwnr: number) {
    return this.service.setLkwNr(palid, lkwnr);
  }
  @Get('druck/:pid/:kommid')
  @ROLES(ROLE.KONTROLLER)
  getPaleteToDruck(@Param('pid') pid: number, @Param('kommid') kommid: number) {
    return this.service.getPaleteToDruck(pid, kommid);
  }
  @Get('druckall/:kid')
  @ROLES(ROLE.KONTROLLER)
  getPalettenToDruck(@Param('kid') kid:number) {
    return this.service.getPalettenToDruck(kid);
  }
  @Patch('palt/:palid/:typ')
  setPaleteTyp(@Param('palid') palid: number, @Param('typ') typ: string) {
    return this.service.changePaletteTyp(palid, typ);
  }
  @Patch('palg/:palid/:gw')
  setPaleteGewicht(@Param('palid') palid: number, @Param('gw') gw: number) {
    return this.service.changePalGewicht(palid, gw);
  }
}
