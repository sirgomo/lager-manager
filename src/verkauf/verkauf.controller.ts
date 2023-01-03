import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { AddArtikelKommissDTO } from 'src/DTO/addArtikelKommissDTO';
import { ArtikelKommissDTO } from 'src/DTO/artikelKommissDTO';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { ROLE } from 'src/entity/UserEntity';
import { VerkaufService } from './verkauf.service';

@Controller('verkauf')
@UseGuards(AuthGuard(), RoleGuard)
export class VerkaufController {
  constructor(private verkService: VerkaufService) {}
  @Get()
  @ROLES(ROLE.VERKAUF)
  async getAllKomissionierungen(): Promise<KommissionirungEntity[]> {
    return await this.verkService.getAllKommiss();
  }
  @Get(':id')
  @ROLES(ROLE.VERKAUF)
  async getAllByVerkaufer(
    @Param('id') verkuferid: number,
  ): Promise<KommissionirungEntity[]> {
    return await this.verkService.getAllKommisByVerkaufer(verkuferid);
  }
  //get not workig WHY ?
  @Post('art')
  @ROLES(ROLE.VERKAUF)
  async getArtikForKomm(): Promise<ArtikelKommissDTO[]> {
    return await this.verkService.getArtikels();
  }
  @Get('art/:id')
  @ROLES(ROLE.VERKAUF)
  async getCurrentVerfugArtikelMenge(@Param('id') artId: number) {
    return await this.verkService.getCurrentArtikelMenge(artId);
  }
  @Post('addart')
  @ROLES(ROLE.VERKAUF)
  async addArtikelToKomm(@Body(ValidationPipe) art: AddArtikelKommissDTO[]) {
    return await this.verkService.addArtikelToKommiss(art);
  }

  @Post('/new')
  @ROLES(ROLE.VERKAUF)
  createNewKommissionierung(
    @Body(ValidationPipe) kom: KomissDTO,
  ): Promise<KommissionirungEntity> {
    return this.verkService.createKommiss(kom);
  }
  @Patch('/up')
  @ROLES(ROLE.VERKAUF)
  updateKommissionierung(@Body(ValidationPipe) kom: KomissDTO): Promise<any> {
    return this.verkService.updateKommiss(kom);
  }
  @Delete(':id')
  @ROLES(ROLE.VERKAUF)
  deleteKomm(@Param('id') id: number) {
    return this.verkService.deleteKomm(id);
  }
  @Delete('/detaId/:id')
  @ROLES(ROLE.VERKAUF)
  deletePositionInKom(@Param('id') id: number) {
    return this.verkService.deleteArtikelFromKomm(id);
  }
  @Get('/total/:id')
  @ROLES(ROLE.VERKAUF)
  getTotalGewichtAndMenge(@Param('id') kommId: number) {
    return this.verkService.getVorausgesehenPaletenMenge(kommId);
  }
  @Patch('/komm/:id')
  @ROLES(ROLE.VERKAUF)
  changeKommStatus(
    @Body(ValidationPipe) status: any,
    @Param('id') kommId: number,
  ) {
    return this.verkService.changeKommStatus(kommId, status);
  }
  @Get('kommid/:id')
  @ROLES(ROLE.VERKAUF)
  getKommById(@Param('id') id: number) {
    return this.verkService.getKommById(id);
  }
}
