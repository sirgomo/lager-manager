import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Get, Post } from "@nestjs/common/decorators";
import { dispositorsDto } from "src/DTO/dispositorsDto";
import { DisServiceService } from "../dis-service/dis-service.service";
@Controller('dispo')
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