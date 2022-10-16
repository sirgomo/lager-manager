import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Get, Patch, Post } from "@nestjs/common/decorators";
import { dispositorsDto } from "src/DTO/dispositorsDTO";
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