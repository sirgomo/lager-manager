import { Controller, Get, Req, UseGuards, Post, Delete, Body, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { KomissDTO } from 'src/DTO/KomissDTO';
import { ROLE } from 'src/entity/UserEntity';
import { KommissionierService } from './komissionier.service';

@Controller('komi')
@UseGuards(AuthGuard(), RoleGuard)
export class KomissionierController {
    constructor(private komSercive : KommissionierService){}

    @Get('getall')
    @ROLES(ROLE.VERKAUF)
    getAllkommissionierungen(){
        return this.komSercive.getAllKomisionirungen();
    }
    @Get()
    @ROLES(ROLE.VERKAUF)
    getAllkommissionierungenById(@Req() req : any){
        return this.komSercive.getAllKomissionierungenByVerkaufer(req.user.id);
    }
    @Post()
    @ROLES(ROLE.VERKAUF)
    createKommiss(@Body(ValidationPipe) komm : KomissDTO, @Req() req : any){
        return this.komSercive.createKommiss(komm, req.user.id);
    }
    @Delete(':id')
    @ROLES(ROLE.VERKAUF)
    deleteKommis(@Param('id') id:number, @Req() req: any){
        return this.komSercive.deleteKomm(id, req.user.id);
    }
    

}
