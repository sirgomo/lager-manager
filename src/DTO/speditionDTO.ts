import { IsNotEmpty,IsNumber,IsOptional,Length } from "class-validator";

export class SpeditionDTO{
id : number;
@IsNotEmpty()
@Length(3, 20, {message: 'Min 3 buchstaben max 20'})
name : string;
@IsOptional()
name2:string;
@IsNotEmpty()
@IsNumber()
maxLadeGewicht : number;
@IsNotEmpty()
@IsNumber()
maxPalettenMenge : number;
@IsNotEmpty()
@Length(3, 20, {message: 'Min 3 buchstaben max 20'})
stadt:string;
@IsNotEmpty()
@Length(3, 20, {message: 'Min 3 buchstaben max 20'})
strasseUndNr:string;
@IsNotEmpty()
@IsNumber()
postleitzahl :number;
@IsNotEmpty()
@Length(3, 20, {message: 'Min 3 buchstaben max 20'})
uStIdentifikationsnummer:string;
}