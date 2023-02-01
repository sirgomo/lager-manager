/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { PALETTENTYP } from "src/entity/lagerPlatzEntity";

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
    @IsOptional()
    palettenTyp : PALETTENTYP;
    @IsOptional()
    mhd : Date; 
    @IsOptional()
    lagerPlatzVolumen : number;
    @IsOptional()
    mengeProPalete : number;
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @IsNotEmpty()
    static : boolean = false;
    @IsOptional()
    liferant:number;
    @IsOptional()
    barcode:string;
    @IsNotEmpty()
    @IsNumber()
    prufziffern:number;

}