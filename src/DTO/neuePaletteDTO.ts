import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PALETTENTYP } from 'src/entity/lagerPlatzEntity';

export class NeuePaletteDTO {
  @IsOptional()
  @IsNumber()
  palid: number;
  @IsNotEmpty()
  @IsNumber()
  kommId: number;
  @IsNotEmpty()
  palTyp: PALETTENTYP;
  @IsNotEmpty()
  @IsNumber()
  kommissionierId: number;
  @IsNotEmpty()
  @IsNumber()
  gewicht: number;
  @IsNotEmpty()
  @IsNumber()
  liferant: number;
}
