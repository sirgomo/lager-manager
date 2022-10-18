import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { ROLES } from "src/auth/roleDecorator";
import { RoleGuard } from "src/auth/RoleGuard";
import { dispositorsDto } from "src/DTO/dispositorsDTO";
import { ROLE } from "src/entity/userEntity";
import { DisServiceService } from "./disService";
@Controller('dispo')
@UseGuards(AuthGuard(), RoleGuard)
export class DisControllerController{
    constructor(private disService : DisServiceService){}
    @Get()
    getAllDispositors(){
       return this.disService.getAllDisponets();
    }
    
    @Post()
    @ROLES(ROLE.KAUF)
    @ROLES(ROLE.VERKAUF)
    createNewDispositors(@Body(ValidationPipe) disDto : dispositorsDto){
      return  this.createNewDispositors(disDto);
    }
    @Patch(':id')
    @ROLES(ROLE.KAUF)
    @ROLES(ROLE.VERKAUF)
    updateDispositor(@Body(ValidationPipe) data: dispositorsDto, @Param('id') id:number){
      return this.disService.updateDipositors(id, data);
    }
    @Delete(':id')
    @ROLES(ROLE.KAUF)
    @ROLES(ROLE.VERKAUF)
    deleteDispositor(@Param('id') id: number){
      return this.disService.deleteDiponent(id);
    }
 


}