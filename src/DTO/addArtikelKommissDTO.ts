import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class AddArtikelKommissDTO{
    @IsNotEmpty()
    @IsNumber()
    artikelId:number;
    @IsNotEmpty()
    @IsNumber()
    artMenge:number;
    @IsNotEmpty()
    @IsNumber()
    kommNr:number;
    @IsOptional()
    kommDeatailnr:number;
}