import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { registerUserDTO } from 'src/DTO/registerUserDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService){}

    @Post('/reg')
    registerUser(@Body(ValidationPipe) reg: registerUserDTO){
      return  this.service.registerUser(reg);
    }
    @Post()
    loginUser(@Body(ValidationPipe) log: registerUserDTO){
        return this.service.loginUser(log);
    }
}
