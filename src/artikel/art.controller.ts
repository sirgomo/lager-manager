import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { artikelDTO } from 'src/DTO/artikelDTO';
import { artikelFlage } from 'src/entity/artikelEntity';
import { ROLE, userEntity } from 'src/entity/userEntity';
import { artikelflagsPipers } from 'src/pipes/artikelFlagspipes';
import { artService } from './art.service';

@Controller('artikel')
@UseGuards(AuthGuard(), RoleGuard)
export class artController {
    constructor(private artService : artService){}

    @Get()
    getAllArtikels(){
        return this.artService.getAllArticel();
    }
    @Post()
    @ROLES(ROLE.WARENPFHLEGE)
    createArtikel(@Body(ValidationPipe) data : artikelDTO){
        return this.artService.createArtikel(data);
    }
    //@Patch(':id')
    //updateArtikel(@Body('artikelFlag', artikelflagsPipers) artikelFlag: artikelFlage, 
    //@Param('id') id: number){
    @Patch(':id')
    @ROLES(ROLE.WARENPFHLEGE)
    updateArtikel(@Body(ValidationPipe) data: artikelDTO, 
    @Param('id') id: number){
       return this.artService.updateArtikel(data, id);
    }
    @Delete(':id')
    @ROLES(ROLE.WARENPFHLEGE)
    deleteArtikel(@Param('id') id: number, ){
      return  this.artService.deleteArtikel(id);
     //   return this.artService.getAllArticel();
    }
}
