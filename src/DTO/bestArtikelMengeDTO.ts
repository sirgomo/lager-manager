import { IsNotEmpty, IsNumber } from "class-validator";

export class BestArtikelMengeDTO{
    @IsNotEmpty()
    @IsNumber()
    bestellungId: number;
    @IsNotEmpty()
    @IsNumber()
    artikelId : number;
    @IsNotEmpty()
    @IsNumber()
    menge : number;
}