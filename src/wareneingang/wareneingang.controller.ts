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
import { WarenBuchungDto } from 'src/DTO/warenBuchungDTO';
import { WarenEingArticleDTO } from 'src/DTO/warenEingArticleDTO';
import { LagerPlatzEntity } from 'src/entity/LagerPlatzEntity';
import { ROLE } from 'src/entity/UserEntity';
import { WareneingangService } from './wareneingang.service';

@Controller('wareneingang')
@UseGuards(AuthGuard(), RoleGuard)
export class WareneingangController {
  constructor(private serv: WareneingangService) {}
  @Get()
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  getAllLiferungen(): Promise<WarenBuchungDto[]> {
    return this.serv.getAllBuchngen();
  }
  @Get(':id')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  getArtikles(@Param('id') liferungid: number): Promise<WarenEingArticleDTO[]> {
    return this.serv.getArtikels(liferungid);
  }
  @Post('/platz')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  getPlatzFurArtikel(
    @Body(ValidationPipe) art: ArtikelMengeDTO,
  ): Promise<LagerPlatzEntity> {
    return this.serv.getPlatz(art);
  }
  @Post()
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  lageEs(@Body(ValidationPipe) body: LagerPlatztDTO) {
    return this.serv.lageEs(body);
  }
  @Delete(':id/:bestid')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  deleteArtikel(@Param('id') artid: number, @Param('bestid') bestid: number) {
    return this.serv.delArtikel(artid, bestid);
  }
  @Post('/art')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  updateArtikel(@Body(ValidationPipe) art: WarenEingArticleDTO) {
    return this.serv.updateArtikel(art);
  }
  @Get('gang/:id')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  getPlatzeimGane(@Param('id') gangnr: number) {
    return this.serv.getPlatzeInGanges(gangnr);
  }
  @Get('/count/1')
  @ROLES(ROLE.WARENEINGANG, ROLE.LAGERVERWALTUNG)
  getCountOfPlatze() {
    return this.serv.getPlatzeCount();
  }
  @Get('/art/:id/:lid')
  @ROLES(ROLE.LAGERVERWALTUNG, ROLE.WARENEINGANG)
  getStaticPlatzMitWare(@Param('id') aid: number, @Param('lid') lid: number) {
    return this.serv.getStaticPlatzeMitArtikel(aid, lid);
  }
}
