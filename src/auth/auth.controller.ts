import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RegiUserDTO } from 'src/DTO/regiUserDTO';
import { UserLogDTO } from 'src/DTO/userLogDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService){}

    @Post('/reg')
    registerUser(@Body(ValidationPipe) reg: RegiUserDTO){
      return  this.service.registerUser(reg);
    }
    @Post()
    loginUser(@Body(ValidationPipe) log: UserLogDTO){
        return this.service.loginUser(log);
    }
}
