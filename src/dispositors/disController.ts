import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { ROLES } from "src/auth/roleDecorator";
import { RoleGuard } from "src/auth/roleGuard";
import { DispositorsDTO } from "src/DTO/dispositorsDTO"
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
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    createNewDispositors(@Body(ValidationPipe) disDto : DispositorsDTO){
      return  this.disService.createDisponets(disDto);
    }
    @Patch(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    updateDispositor(@Body(ValidationPipe) data: DispositorsDTO, @Param('id') id:number){
      return this.disService.updateDipositors(id, data);
    }
    @Delete(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.DATAPFHLEGE)
    deleteDispositor(@Param('id') id: number){
      return this.disService.deleteDiponent(id);
    }
 


}