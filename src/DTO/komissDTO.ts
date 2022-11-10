import { isDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { KommisioDetailsEntity } from "src/entity/KommisioDetailsEntity";
import { KOMMISIONSTATUS } from "src/entity/KommissionirungEntity";


export class KomissDTO{
    @IsOptional()
    id : number;
    @IsNotEmpty()
    verkauferId: number;
    @IsNotEmpty({message: ' Max palaten höher in cm'})
    maxPalettenHoher : number;
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
    @IsOptional()
    kommDetails : KommisioDetailsEntity[];
}