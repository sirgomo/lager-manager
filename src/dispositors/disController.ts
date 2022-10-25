import { ValidationPipe } from "@nestjs/common";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common/decorators";
import { AuthGuard } from "@nestjs/passport";
import { ROLES } from "src/auth/roleDecorator";
import { RoleGuard } from "src/auth/RoleGuard";
import { DispositorsDTO } from "src/DTO/DispositorsDTO";
import { ROLE } from "src/entity/UserEntity";
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
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    createNewDispositors(@Body(ValidationPipe) disDto : DispositorsDTO){
      return  this.disService.createDisponets(disDto);
    }
    @Patch(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    updateDispositor(@Body(ValidationPipe) data: DispositorsDTO, @Param('id') id:number){
      return this.disService.updateDipositors(id, data);
    }
    @Delete(':id')
    @ROLES(ROLE.KAUF,ROLE.VERKAUF,ROLE.WARENPFHLEGE)
    deleteDispositor(@Param('id') id: number){
      return this.disService.deleteDiponent(id);
    }
 


}