import { Length, IsNotEmpty } from "class-validator";

export class UserLogDTO{
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 buchstaben'})
    username : string;
    @IsNotEmpty()
    @Length(4,30, {message: 'Min 4 max 30 Buchstaben'})
    password: string;
}