import {  IsNotEmpty, Length, IsOptional, IsNumber, Min, IsDate } from 'class-validator';
import { artikelFlage } from 'src/entity/ArtikelEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
export class ArtikelDTO{
    @IsOptional()
    @IsNumber()
    artikelId: number;
    @IsNotEmpty()
    name: string;
    uid: UiidEntity[];
    @IsNotEmpty()
    @IsNumber()
    gewicht: number;
    @IsNotEmpty()
    @Length(6)
    grosse: string;
    @IsNotEmpty()
    @IsNumber()
    basisEinheit: number;
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