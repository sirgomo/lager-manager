import {  IsNotEmpty, Length, IsOptional, IsNumber, Min, IsDate } from 'class-validator';
import { artikelFlage } from 'src/entity/artikelEntity';
import { uiidEntity } from 'src/entity/uiidEntity';
export class artikelDTO{
    @IsOptional()
    @IsNumber()
    artikelId: number;
    @IsNotEmpty()
    name: string;
    uid: uiidEntity[];
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