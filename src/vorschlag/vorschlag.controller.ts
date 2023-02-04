import { Body, Controller, Delete, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { VorschalgDTO } from 'src/DTO/vorschlagDTO';
import { ROLE } from 'src/entity/userEntity';
import { VorschlagService } from './vorschlag.service';

@Controller('vorschlag')
@UseGuards(AuthGuard(), RoleGuard)
export class VorschlagController {

    constructor(private vorschServ: VorschlagService) {}
    @Get()
    @ROLES(ROLE.ADMIN)
    getVorschlags() { 
       return this.vorschServ.getVorschlags();
    }
    @Get(':id')
    @ROLES(ROLE.ADMIN)
    getVorschlagById(@Param('id') vorschlagId: number) {
        return this.vorschServ.getVorschlagById(vorschlagId);
    }
    @Delete(':id')
    @ROLES(ROLE.ADMIN)
    deleteVorschlag(@Param('id') vorschlagId: number) {
        return this.vorschServ.deleteVorschlag(vorschlagId);
    }
    @Post()
    createVorschlag(@Body(ValidationPipe) vorschlag: VorschalgDTO) {
        return this.vorschServ.createVorschalg(vorschlag);
    }
}
