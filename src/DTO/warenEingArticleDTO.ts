import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class WarenEingArticleDTO{
    @IsNotEmpty()
    @IsNumber()
    bestellungId: number;
    @IsNotEmpty()
    @IsNumber()
    artikelid : number;
    @IsNotEmpty()
    @IsNumber()
    menge : number;
    @IsOptional()
    name:string;
}