import { Controller } from '@nestjs/common';
import { WareausgangService } from './wareausgang.service';

@Controller('wareausgang')
export class WareausgangController {
    constructor(private service: WareausgangService) {}
}
