import {  IsNotEmpty, Length, IsOptional, IsNumber, Min, IsDate } from 'class-validator';
import { artikelFlage } from 'src/entity/artikelEntity';
export class artikelDTO{
    @IsOptional()
    @IsNumber()
    id: number;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    uid: string;
    @IsNotEmpty()
    @IsNumber()
    gewicht: number;
    @IsNotEmpty()
    @Length(6)
    grosse: string;
    @IsNotEmpty()
    @IsNumber()
    basisEinheit: number;
    @IsOptional()
    mhd: string;
    @IsNotEmpty()
    @IsNumber()
    minLosMenge: number;
    @IsNumber()
    @IsNotEmpty()
    durchschnittlicheLagerdauer: number;
    @IsNotEmpty()
    @IsNumber()
    umschlagshaufigkeit: number;
    @IsNotEmpty()
    @IsNumber()
    durschnittlicherLagerbestand: number;
    @IsNotEmpty()
    artikelFlage: artikelFlage;
}