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
    @ROLES(ROLE.KOMMISIONIER)
    getAllkommissionierungen(){
      
    }
    @Get()
    @ROLES(ROLE.KOMMISIONIER)
    getAllkommissionierungenById(@Req() req : any){
       
    }
 
    

}
