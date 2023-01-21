import { IsNotEmpty, IsNumber } from "class-validator";

export class ArtikelSchiebenDTO {
    @IsNotEmpty()
    @IsNumber()
    kommid: number;
    @IsNotEmpty()
    @IsNumber()
    kommDetailsid: number;
    @IsNotEmpty()
    @IsNumber()
    menge: number;
}