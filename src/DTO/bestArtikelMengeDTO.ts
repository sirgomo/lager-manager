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
    @IsNotEmpty()
    @IsNumber()
    priceNetto:number;
    @IsNotEmpty()
    @IsNumber()
    mehrwertsteuer:number;
    @IsNotEmpty()
    @IsNumber()
    liferantId:number;
}