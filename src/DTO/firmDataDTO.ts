import { IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";

export class FirmDataDTO {
    @IsOptional()
    id:number
    @IsNotEmpty()
    @Length(3,30)
    rfirmname: string;
    @IsOptional()
    rname: string;
    @IsNotEmpty()
    @Length(3, 30)
    rstrasse: string;
    @IsNotEmpty()
    @IsNumber()
    rhausnr: number;
    @IsNotEmpty()
    @Length(3, 30)
    rstadt: string;
    @IsNotEmpty()
    rpostleitzahl: number;
    @IsOptional()  
    lfirmname: string;
    @IsOptional()
    lname: string;
    @IsOptional()
    lstrasse: string;
    @IsOptional()
    lhausnr: number;
    @IsOptional()
    lstadt: string;
    @IsOptional()  
    lpostleitzahl: number;
    @IsNotEmpty()
    steuernummer: string;
    @IsOptional()
    steuerid: string;
    @IsNotEmpty()
    ustid: string;
}