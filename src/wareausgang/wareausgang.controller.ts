import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { ROLE } from 'src/entity/userEntity';
import { WareausgangService } from './wareausgang.service';

@Controller('wausgang')
@UseGuards(AuthGuard(), RoleGuard)
export class WareausgangController {
    constructor(private service: WareausgangService) {}
    @Get(':status')
    @ROLES(ROLE.WAUSGANG)
    getFertigKommissionierungen(@Param('status') status: string) {
        return this.service.getFertigKommissionierungen(status);
    }   
    @Get('komm/:id')
    @ROLES(ROLE.WAUSGANG)
    getKommisionierungByNr(@Param('id') id: number) {
        return this.service.getKommiessionierung(id);
    }
}
