import { Controller, Get, Req, UseGuards, Post, Delete, Body, ValidationPipe, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/RoleGuard';
import { NeuePaletteDTO } from 'src/DTO/neuePaletteDTO';
import { ROLE } from 'src/entity/UserEntity';
import { KommissionierService } from './komissionier.service';

@Controller('komi')
@UseGuards(AuthGuard(), RoleGuard)
export class KomissionierController {
    constructor(private komSercive : KommissionierService){}

    @Get(':id')
    @ROLES(ROLE.KOMMISIONIER)
    getAllkommissionierungenById(@Param('id') id:number){
       return this.komSercive.getKommissionierung(id);
    }
    @Post('/neupal')
    @ROLES(ROLE.KOMMISIONIER)
    neuePaletteErstellen(@Body(ValidationPipe) data: NeuePaletteDTO){
        console.log(data);
        return this.komSercive.neuePalete(data);
    }
    @Post('/gerf')
    @ROLES(ROLE.KOMMISIONIER)
    gewichtErfassen(@Body(ValidationPipe) data: NeuePaletteDTO){
        console.log(data);
        return this.komSercive.gewichtErfassen(data);
    }
    @Get('/lastkomm/:id')
    @ROLES(ROLE.KOMMISIONIER)
    getLastActiveKomm(@Param('id') kommissid:number){
        return this.komSercive.getlastActiveKom(kommissid);
    }
 
    

}
