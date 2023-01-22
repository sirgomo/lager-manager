import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { ArtikelDTO } from 'src/DTO/ArtikelDTO';
import { ROLE } from 'src/entity/UserEntity';
import { ArtikelflagsPipers } from 'src/pipes/artikelFlagspipes';
import { ArtService } from './art.service';

@Controller('artikel')
@UseGuards(AuthGuard(), RoleGuard)
export class ArtController {
  constructor(private artService: ArtService) {}

  @Get()
  getAllArtikels() {
    return this.artService.getAllArticel();
  }
  @Get(':id')
  getArtikel(@Param('id') id: number) {
    return this.artService.getArtikel(id);
  }
  @Post()
  @ROLES(ROLE.DATAPFHLEGE)
  @UsePipes(ArtikelflagsPipers)
  createArtikel(@Body(ValidationPipe) data: ArtikelDTO) {
    return this.artService.createArtikel(data);
  }
  //@Patch(':id')
  //updateArtikel(@Body('artikelFlag', ArtikelflagsPipers) artikelFlag: ARTIKELFLAGE,
  //@Param('id') id: number){
  @Patch()
  @ROLES(ROLE.DATAPFHLEGE)
  updateArtikel(@Body(ValidationPipe) data: ArtikelDTO) {
    return this.artService.updateArtikel(data);
  }
  @Delete(':id')
  @ROLES(ROLE.DATAPFHLEGE)
  deleteArtikel(@Param('id') id: number) {
    return this.artService.deleteArtikel(id);
    //   return this.ArtService.getAllArticel();
  }
}
