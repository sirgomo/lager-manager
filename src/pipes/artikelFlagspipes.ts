import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ArtikelDTO } from "src/DTO/ArtikelDTO";
import { artikelFlage } from "src/entity/ArtikelEntity";

export class ArtikelflagsPipers implements PipeTransform{
  

    transform(value : ArtikelDTO, metadata : ArgumentMetadata) : any {
       
        if(!this.isStatusValid(value.artikelFlage)){
            throw new BadRequestException (`$value ist falsch.`);
        }
        return value;
    }
    private isStatusValid(value: any) : boolean{
        return  Object.values(artikelFlage).includes(value); 
    }

}