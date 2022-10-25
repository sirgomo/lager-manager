
import {  IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
export class DispositorsDTO {
    @IsOptional()
    @IsNumber()
    id : number;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    name : string;
    @IsNotEmpty()
    @Length(3, 30, {message : 'Es sollte min 3 und max 30 buchstaben sein'})
    anschrift : string;
}