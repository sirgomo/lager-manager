import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private servi: UserService){}

    @Get(':id')
    async getUserById(@Param('id') id:number){
        return await this.servi.getUserById(id);
    }
}
