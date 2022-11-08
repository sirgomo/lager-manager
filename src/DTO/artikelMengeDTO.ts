import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { PALETTENTYP } from "src/entity/LagerPlatzEntity";

export class ArtikelMengeDTO{
    @IsNotEmpty()
    @IsNumber()
    artikelId:number;
    @IsNotEmpty()
    @IsNumber()
    menge: number;
    @IsOptional()
    mhd: Date;
    @IsNotEmpty()
    palete: PALETTENTYP;
}