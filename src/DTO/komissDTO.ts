import { isDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { kommisioDetailsEntity } from "src/entity/kommisioDetailsEntity";
import { KOMMISIONSTATUS } from "src/entity/kommissionirungEntity";


export class komissDTO{
    @IsOptional()
    id : number;
    @IsNotEmpty()
    verkauferId: number;
    @IsNotEmpty({message: ' Max palaten höher in cm'})
    maxPalettenHöher : number;
    @IsNotEmpty({message: 'Gewustes lifer datum'})
    gewunschtesLieferDatum : Date;
    @IsNotEmpty()
    dispositorId : number;
    @IsNotEmpty({message: 'INBEARBEITUNG oder INKOMMISSIONIRUNG oder FERTIG oder BEREIT'})
    kommissStatus  : KOMMISIONSTATUS;
    @IsNotEmpty()
    spedition : number;
    @IsNotEmpty({message: 'Versorung id'})
    versorungId : string;
    kommDetails : kommisioDetailsEntity;
}