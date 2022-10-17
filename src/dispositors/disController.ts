import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { dispositorsDto } from "src/DTO/dispositorsDTO";
import { DisServiceService } from "./disService";
@Controller('dispo')
@UseGuards(AuthGuard())
export class DisControllerController{
    constructor(private disService : DisServiceService){}
    @Get()
    getAllDispositors(){
       return this.disService.getAllDisponets();
    }
    @Post()
    createNewDispositors(@Body(ValidationPipe) disDto : dispositorsDto){
      return  this.createNewDispositors(disDto);
    }
 


}