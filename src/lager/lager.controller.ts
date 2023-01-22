import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { LagerPlatztDTO } from 'src/DTO/lagerPlatztDTO';
import { ROLE } from 'src/entity/UserEntity';
import { LagerService } from './lager.service';

@Controller('lager')
@UseGuards(AuthGuard(), RoleGuard)
export class LagerController {
  constructor(private lagerServ: LagerService) {}

  @Get()
  getAllStellplatze() {
    return this.lagerServ.getStellpletze();
  }

  @Post('/art')
  getPlatzFurArtikel(@Body(ValidationPipe) artMen: ArtikelMengeDTO) {
    return this.lagerServ.getPlatzFurArtikel(artMen);
  }

  @Post()
  @ROLES(ROLE.LAGERVERWALTUNG)
  createStellplatz(@Body(ValidationPipe) data: LagerPlatztDTO) {
    return this.lagerServ.createLagerPlatz(data);
  }

  @Delete(':id')
  @ROLES(ROLE.LAGERVERWALTUNG)
  deleteLageplatzt(@Param('id') id: number) {
    return this.lagerServ.deleteLageplatzt(id);
  }
  @Get('platz/:artid/:lifid')
  @ROLES(ROLE.LAGERVERWALTUNG)
  getPlatzeMitArtikel(
    @Param('artid') artid: number,
    @Param('lifid') lifid: number,
  ) {
    return this.lagerServ.getPlattzeMitArtikel(artid, lifid);
  }
}
