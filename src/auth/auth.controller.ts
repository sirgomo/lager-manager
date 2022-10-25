import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { RegisterUserDTO } from 'src/DTO/RegisterUserDTO';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private service: AuthService){}

    @Post('/reg')
    registerUser(@Body(ValidationPipe) reg: RegisterUserDTO){
      return  this.service.registerUser(reg);
    }
    @Post()
    loginUser(@Body(ValidationPipe) log: RegisterUserDTO){
        return this.service.loginUser(log);
    }
}
