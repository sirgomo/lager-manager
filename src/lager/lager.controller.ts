import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { ArtikelMengeDTO } from 'src/DTO/artikelMengeDTO';
import { ROLE } from 'src/entity/UserEntity';
import { LagerService } from './lager.service';

@Controller('lager')
@UseGuards(AuthGuard(), RoleGuard)
export class LagerController {
    constructor(private lagerServ: LagerService){}

    @Get()
    getAllStellplatze(){
        return this.lagerServ.getStellpletze();
    }
   @Post('/art')
   getPlatzFurArtikel(@Body(ValidationPipe) artMen : ArtikelMengeDTO){
    return  this.lagerServ.getPlatzFurArtikel(artMen);
   }
}
