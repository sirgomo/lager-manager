import { IsNotEmpty, IsNumber } from 'class-validator';
import { PALETTENTYP } from 'src/entity/lagerPlatzEntity';

export class ArtikelAufPaletteDTO {
  @IsNotEmpty()
  @IsNumber()
  paletteid: number;
  @IsNotEmpty()
  @IsNumber()
  kommissId: number;
  @IsNotEmpty()
  @IsNumber()
  artikelMenge: number;
  @IsNotEmpty()
  @IsNumber()
  artid: number;
  @IsNotEmpty()
  palTyp: PALETTENTYP;
  @IsNotEmpty()
  @IsNumber()
  kommissionierId: number;
  @IsNotEmpty()
  @IsNumber()
  platzid: number;
  @IsNotEmpty()
  @IsNumber()
  liferantId: number;
}
