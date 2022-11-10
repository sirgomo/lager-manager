import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { KommissionirungEntity } from 'src/entity/KommissionirungEntity';
import { ROLE } from 'src/entity/UserEntity';
import { VerkaufService } from './verkauf.service';

@Controller('verkauf')
@UseGuards(AuthGuard(), RoleGuard)
export class VerkaufController {
    constructor(private verkService : VerkaufService){
    }
    @Get()
    @ROLES(ROLE.VERKAUF)
    getAllKomissionierungen():Promise<KommissionirungEntity[]>{
        return this.verkService.getAllKommiss();
    }
    @Get(':id')
    @ROLES(ROLE.VERKAUF)
    getAllByVerkaufer(@Param('id') verkuferid: number):Promise<KommissionirungEntity[]>{
        return this.verkService.getAllKommisByVerkaufer(verkuferid);
    }
    @Post()
    @ROLES(ROLE.VERKAUF)
    createNewKommissionierung(@Body(ValidationPipe) kom: KomissDTO):Promise<KommissionirungEntity>{
        return;
    }
    @Post()
    @ROLES(ROLE.VERKAUF)
    updateKommissionierung(@Body(ValidationPipe) kom: KomissDTO):Promise<KommissionirungEntity>{
        return;
    }
    @Delete(':id')
    @ROLES(ROLE.VERKAUF)
    deleteKomm(@Param('id') id:number){
        
    }
    
}
