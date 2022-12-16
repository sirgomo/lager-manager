import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class WarenBuchungDto{
    @IsOptional()
    @IsNumber()
    id : number
    @IsOptional()
    artikelid : number;
    @IsOptional()
    menge : number;
    @IsOptional()
    tor : string;
    @IsNotEmpty()
    @IsNumber()
    kreditorId: number;
    @IsOptional()
    eingebucht : boolean;
    @IsNotEmpty()
    @IsNumber()
    bestellungId : number;
    @IsOptional()
    artikelsGebucht: boolean;
    @IsNotEmpty()
    lieferscheinNr:string;
    @IsNotEmpty()
    @IsDateString()
    empfangDatum: Date;
    @IsOptional()
    @IsNumber()
    priceNetto: number;
    @IsOptional()
    @IsNumber()
    mehrwertsteuer:number;
}