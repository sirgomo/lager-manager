import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { artikelFlage } from "src/entity/ArtikelEntity";

export class ArtikelflagsPipers implements PipeTransform{
    readonly erlaubtesFlags : artikelFlage[] = [artikelFlage.ALK, artikelFlage.FASS, artikelFlage.SUSS];

    transform(value : any, metadata : ArgumentMetadata) : any {
        value = value.toUpperCase();
        if(!this.isStatusValid(value)){
            throw new BadRequestException (`$value ist falsch.`);
        }
        return value;
    }
    private isStatusValid(value: any) : boolean{
       const index : number = this.erlaubtesFlags.indexOf(value);
       return index === -1;
    }

}