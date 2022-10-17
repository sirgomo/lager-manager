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
    @ROLES(ROLE.WARENPFHLEGE)
    getAllDispositors(){
       return this.disService.getAllDisponets();
    }
    
    @Post()
    createNewDispositors(@Body(ValidationPipe) disDto : dispositorsDto){
      return  this.createNewDispositors(disDto);
    }
    @Patch(':id')
    updateDispositor(@Body(ValidationPipe) data: dispositorsDto, @Param('id') id:number){
      return this.disService.updateDipositors(id, data);
    }
    @Delete(':id')
    deleteDispositor(@Param('id') id: number){
      return this.disService.deleteDiponent(id);
    }
 


}