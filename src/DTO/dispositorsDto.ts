
import {  IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
export class DispositorsDTO {
    @IsOptional()
    @IsNumber()
    id : number;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    name : string;
    @IsOptional()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    name2:string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    stadt:string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    strasseUndNr:string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollten nur ziffern sein'})
    @IsNumber()
    postleitzahl :number;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollten nur ziffern sein'})
    uStIdentifikationsnummer:string;
}