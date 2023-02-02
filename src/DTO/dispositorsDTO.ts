
import {  IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
export class DispositorsDTO {
    @IsOptional()
    @IsNumber()
    id : number;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    name : string;
    @IsOptional()
    name2:string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    stadt:string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    strasseUndNr:string;
    @IsNotEmpty()
    @IsNumber()
    postleitzahl :number;
    @IsNotEmpty()
    uStIdentifikationsnummer:string;
}