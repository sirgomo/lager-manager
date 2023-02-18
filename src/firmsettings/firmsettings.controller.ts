import { Body, Controller, Get, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ROLES } from 'src/auth/roleDecorator';
import { RoleGuard } from 'src/auth/roleGuard';
import { FirmDataDTO } from 'src/DTO/firmDataDTO';
import { ROLE } from 'src/entity/userEntity';
import { FirmsettingsService } from './firmsettings.service';

@Controller('firm')
@UseGuards(AuthGuard(), RoleGuard)
export class FirmsettingsController {
    constructor(private service: FirmsettingsService) {}

    @Get()
    @ROLES(ROLE.ADMIN)
    getFirm() {
        return this.service.getFirm();
    }
    @Post('/create')
    @ROLES(ROLE.ADMIN)
    setupFirm(@Body(ValidationPipe) firm: FirmDataDTO) {
        return this.service.saveFirmDaten(firm);
    }
    @Patch('/update')
    @ROLES(ROLE.ADMIN)
    updateFrimData(@Body(ValidationPipe) firm: FirmDataDTO) {
        return this.service.updateFirmDaten(firm);
    }
}

