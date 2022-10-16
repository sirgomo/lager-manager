import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { artikelDTO } from 'src/DTO/artikelDTO';
import { artikelFlage } from 'src/entity/artikelEntity';
import { artikelflagsPipers } from 'src/pipes/artikelFlagspipes';
import { artService } from './art.service';

@Controller('artikel')
export class artController {
    constructor(private artService : artService){}

    @Get()
    getAllArtikels(){
        return this.artService.getAllArticel();
    }
    @Post()
    createArtikel(@Body(ValidationPipe) data : artikelDTO){
        return this.artService.createArtikel(data);
    }
    //@Patch(':id')
    //updateArtikel(@Body('artikelFlag', artikelflagsPipers) artikelFlag: artikelFlage, 
    //@Param('id') id: number){
    @Patch(':id')
    updateArtikel(@Body(ValidationPipe) data: artikelDTO, 
    @Param('id') id: number){
       return this.artService.updateArtikel(data, id);
    }
    @Delete(':id')
    deleteArtikel(@Param('id') id: number){
      return  this.artService.deleteArtikel(id);
     //   return this.artService.getAllArticel();
    }
}
