import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ArtikelMengeDTO{
    @IsNotEmpty()
    @IsNumber()
    artikelId:number;
    @IsNotEmpty()
    @IsNumber()
    menge: number;
    @IsOptional()
    mhd: Date;
}