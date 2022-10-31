import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/RoleGuard';
import { LagerService } from './lager.service';

@Controller('lager')
@UseGuards(AuthGuard(), RoleGuard)
export class LagerController {
    constructor(private lagerServ: LagerService){}

    @Get()
    getAllStellplatze(){
        return this.lagerServ.getStellpletze();
    }
}
