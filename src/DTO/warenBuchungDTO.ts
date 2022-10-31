import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class WarenBuchungDto{
    @IsOptional()
    @IsNumber()
    id : number
    @IsOptional()
    artikelid : number;
    @IsOptional()
    menge : number;
    @IsOptional()
    tor : string;
    @IsNotEmpty()
    @IsNumber()
    dispositorId: number;
    @IsOptional()
    eingebucht : boolean;
    @IsNotEmpty()
    @IsNumber()
    bestellungId : number;
   
}