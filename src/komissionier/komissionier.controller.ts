import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { ArtikelAufPaletteDTO } from 'src/DTO/artikelAufPaletteDTO';
import { NeuePaletteDTO } from 'src/DTO/neuePaletteDTO';
import { ROLE } from 'src/entity/userEntity';
import { KommissionierService } from './komissionier.service';

@Controller('komi')
@UseGuards(AuthGuard(), RoleGuard)
export class KomissionierController {
  constructor(private komSercive: KommissionierService) {}

  @Get(':id')
  @ROLES(ROLE.KOMMISIONIER)
  getAllkommissionierungenById(@Param('id') id: number) {
    return this.komSercive.getKommissionierung(id);
  }
  @Post('/neupal')
  @ROLES(ROLE.KOMMISIONIER)
  neuePaletteErstellen(@Body(ValidationPipe) data: NeuePaletteDTO) {
    console.log(data);
    return this.komSercive.neuePalete(data);
  }
  @Post('/gerf')
  @ROLES(ROLE.KOMMISIONIER)
  gewichtErfassen(@Body(ValidationPipe) data: NeuePaletteDTO) {
    return this.komSercive.gewichtErfassen(data);
  }
  @Get('/lastkomm/:id')
  @ROLES(ROLE.KOMMISIONIER)
  getLastActiveKomm(@Param('id') kommissid: number) {
    return this.komSercive.getlastActiveKom(kommissid);
  }
  @Post('/art')
  @ROLES(ROLE.KOMMISIONIER)
  artikelAufPalette(
    @Body(ValidationPipe)
    art: ArtikelAufPaletteDTO,
  ) {
    return this.komSercive.addAdrtikelToPalete(art);
  }
  @Get('/artikel/:aid/:lid')
  @ROLES(ROLE.KOMMISIONIER)
  getPlatzmitArtikel(@Param('aid') aid: number, @Param('lid') lid: number) {
    return this.komSercive.getLagerPatzMitArtikel(aid, lid);
  }
  @Get('/menge/:aid/:lid')
  @ROLES(ROLE.KOMMISIONIER)
  getMengeOnStaticPlatz(@Param('aid') aid: number, @Param('lid') lid: number) {
    return this.komSercive.getMengeOnStaticPlatz(aid, lid);
  }
  @Get('/platz/:sid/:hid')
  @ROLES(ROLE.KOMMISIONIER)
  getFullePlatzNach(@Param('sid') aid: number, @Param('hid') hid: number) {
    return this.komSercive.lagerPlatzNachfullen(aid, hid);
  }
}
