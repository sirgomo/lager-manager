import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { artikelDTO } from 'src/DTO/artikelDTO';
import { ArtserviceService } from '../artservice/artservice.service';

@Controller('artikel')
export class ArtcontrollerController {
    constructor(private artService : ArtserviceService){}

    @Get()
    getAllArtikels(){
        return this.artService.getAllArticel();
    }
    @Post()
    createArtikel(@Body(ValidationPipe) data : artikelDTO){
        return this.artService.createArtikel(data);
    }
}
