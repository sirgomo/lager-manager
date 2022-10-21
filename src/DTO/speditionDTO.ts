import { IsNotEmpty,Length } from "class-validator";

export class speditionDTO{
id : number;
@IsNotEmpty()
@Length(3, 20, {message: 'Min 3 buchstaben max 20'})
name : string;
@IsNotEmpty()
maxLadeGewicht : number;
@IsNotEmpty()
maxPalettenMenge : number;
}