import {  IsNotEmpty, Length, IsOptional, IsNumber } from 'class-validator';
export class registerUserDTO{
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 buchstaben'})
    username : string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    password: string;
}