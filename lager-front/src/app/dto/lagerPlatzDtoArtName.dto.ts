import { PALETTENTYP } from './lagerPlatz.dto';

export class LagerPlatzDtoArtNameDto {
  id!: number;
  lagerplatz!: string;
  artId!: number;
  artikelMenge!: number;
  name!: string;
  einheit!: number;
  palettenTyp!: PALETTENTYP;
  mhd!: Date;
  lagerPlatzVolumen!: number;
  static = false;
  liferant!: number;
  mengeProPalete!: number;
  barcode!: number;
  prufziffern!: number;
  lifer!: string;
}
