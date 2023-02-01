import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ArtikelDTO } from "src/DTO/artikelDTO";
import { ARTIKELFLAGE } from "src/entity/artikelEntity";

export class ArtikelflagsPipers implements PipeTransform{
  

    transform(value : ArtikelDTO, metadata : ArgumentMetadata) : any {
       
        if(!this.isStatusValid(value.artikelFlage)){
            throw new BadRequestException (`$value ist falsch.`);
        }
        return value;
    }
    private isStatusValid(value: any) : boolean{
        return  Object.values(ARTIKELFLAGE).includes(value); 
    }

}