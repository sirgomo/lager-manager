import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { KommisioDetailsEntity } from 'src/entity/KommisioDetailsEntity';
import { KOMMISIONSTATUS } from 'src/entity/KommissionirungEntity';

export class KomissDTO {
  @IsOptional()
  id: number;
  @IsNotEmpty()
  verkauferId: number;
  @IsNotEmpty({ message: ' Max palaten höher in cm' })
  maxPalettenHoher: number;
  @IsNotEmpty({ message: 'Gewustes lifer datum' })
  gewunschtesLieferDatum: Date;
  @IsNotEmpty()
  dispositorId: number;
  @IsNotEmpty()
  @IsNumber()
  skonto: number;
  @IsNotEmpty()
  @IsNumber()
  skontoFrist: number;
  @IsNotEmpty()
  kommissStatus: KOMMISIONSTATUS;
  @IsNotEmpty()
  spedition: number;
  @IsNotEmpty({ message: 'Versorung id' })
  versorgungId: string;
  @IsNotEmpty()
  buchungsDatum!: Date;
  @IsNotEmpty()
  falligkeitDatum!: Date;
  @IsOptional()
  kommDetails: KommisioDetailsEntity[];
}
