import {  IsNotEmpty, Length, IsOptional, IsNumber, Min, IsDate } from 'class-validator';
import { ARTIKELFLAGE } from 'src/entity/ArtikelEntity';
import { UiidEntity } from 'src/entity/UiidEntity';
export class ArtikelDTO{
    @IsOptional()
    @IsNumber()
    aid:number;
    @IsOptional()
    @IsNumber()
    artikelId: number;
    @IsNotEmpty()
    name: string;
    @IsOptional()
    name2: string;
    @IsOptional()
    longBeschriftung:string;
    uids: UiidEntity[];
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
    @IsNotEmpty()
    @IsNumber()
    bestand: number;
    @IsNotEmpty()
    artikelFlage: ARTIKELFLAGE;
    @IsNotEmpty()
    @IsNumber()
    artikelPrice: number;
    @IsNotEmpty()
    @IsNumber()
    verPrice: number;
    @IsNotEmpty()
    @IsNumber()
    mehrwertsteuer: number;
    @IsNotEmpty()
    @IsNumber()
    liferantId: number;

    
    
}