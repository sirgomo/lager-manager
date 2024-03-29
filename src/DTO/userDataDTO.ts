import { IsNotEmpty, IsNumber } from "class-validator";
import { ROLE } from "src/entity/userEntity";

export class UserDataDTO{
    @IsNotEmpty()
    @IsNumber()
    id: number;
    @IsNotEmpty()
    vorname:string;
    @IsNotEmpty()
    nachname:string;
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    role: ROLE;
}