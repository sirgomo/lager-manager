import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { ROLE } from 'src/entity/userEntity';
import { WareausgangService } from './wareausgang.service';

@Controller('wausgang')
@UseGuards(AuthGuard(), RoleGuard)
export class WareausgangController {
    constructor(private service: WareausgangService) {}
    @Get()
    @ROLES(ROLE.WAUSGANG)
    getFertigKommissionierungen() {
        return this.service.getFertigKommissionierungen();
    }   
}
