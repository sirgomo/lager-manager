import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { BestArtikelMengeDTO } from 'src/DTO/bestArtikelMengeDTO';
import { WarenBuchungDto } from 'src/DTO/warenBuchungDTO';
import { ROLE } from 'src/entity/UserEntity';
import { WarenbuchungService } from './warenbuchung.service';

@Controller('warenbuchung')
@UseGuards(AuthGuard(), RoleGuard)
export class WarenbuchungController {
    constructor(private serv : WarenbuchungService){}
@Post()
@ROLES(ROLE.WARENPFHLEGE)
newBestellung(@Body(ValidationPipe) dto: WarenBuchungDto){
    console.log(dto);
    return  this.serv.createBuchung(dto);   
}
@Post('/art')
@ROLES(ROLE.WARENPFHLEGE)
addArtikel(@Body(ValidationPipe) best: BestArtikelMengeDTO){
    return this.serv.addArtikel(best);
}
@Get(':id')
@ROLES(ROLE.WARENPFHLEGE)
getAllArtikels(@Param('id') id:number){
return this.serv.getAllArticles(id);
}

@Delete(':id')
@ROLES(ROLE.WARENPFHLEGE)
deleteBestellung(@Param('id') id:number){
    return this.serv.deletBuchung(id);
} 
@Get()
@ROLES(ROLE.WARENPFHLEGE)
getBuchungen(){
    return this.serv.getBuchungen();
}
}
