import { Controller, UseGuards, Get, Post, Delete, Body, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { speditionDTO } from 'src/DTO/speditionDTO';
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
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    createSpedition(@Body(ValidationPipe) spedition : speditionDTO){
        return this.service.createSpeditor(spedition);
    }
    @Post(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    updateSpedition(@Body(ValidationPipe) spedition : speditionDTO, @Param('id') id: number){
        return this.service.updateSpeditor(spedition, id);
    }
    @Delete(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    deleteSpedition(@Param('id') id: number){
        return this.service.deleteSpeditor(id);
    }


}
