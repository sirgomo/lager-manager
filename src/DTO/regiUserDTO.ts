import {  IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
import { ROLE } from 'src/entity/UserEntity';
export class RegiUserDTO{
    @IsOptional()
    id:number;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 buchstaben'})
    username : string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    userpassword: string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    vorname:string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    nachname:string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    role: ROLE;
}