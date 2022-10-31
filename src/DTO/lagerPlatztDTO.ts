import { IsNotEmpty, IsOptional } from "class-validator";
import { PALETTENTYP } from "src/entity/LagerPlatzEntity";

export class LagerPlatztDTO{
    @IsOptional()
    id : number;
    @IsNotEmpty()
    lagerplatz : string;
    @IsOptional()
    artId : number;
    @IsOptional()
    artikelMenge : number;
    @IsOptional()
    einheit : number;
    @IsNotEmpty()
    palettenTyp : PALETTENTYP;
    @IsOptional()
    mhd : Date; 
    @IsNotEmpty()
    lagerPlatzVolumen : number;
    @IsNotEmpty()
    static : boolean = false;

}