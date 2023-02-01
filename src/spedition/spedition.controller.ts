import { Controller, UseGuards, Get, Post, Delete, Body, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { SpeditionDTO } from 'src/DTO/speditionDTO';
import { ROLE } from 'src/entity/userEntity';
import { SpeditionService } from './spedition.service';

@Controller('sped')
@UseGuards(AuthGuard(), RoleGuard)
export class SpeditionController {
    constructor(private service : SpeditionService){}

    @Get()
    getAllSpeditions(){
        return this.service.getAllSpditors()
    }
    @Post()
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    createSpedition(@Body(ValidationPipe) spedition : SpeditionDTO){
        return this.service.createSpeditor(spedition);
    }
    @Post(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    updateSpedition(@Body(ValidationPipe) spedition : SpeditionDTO, @Param('id') id: number){
        return this.service.updateSpeditor(spedition, id);
    }
    @Delete(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    deleteSpedition(@Param('id') id: number){
        return this.service.deleteSpeditor(id);
    }


}
