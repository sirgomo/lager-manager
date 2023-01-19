import { PALETTENTYP } from './lagerPlatz.dto';

export class ArtikelMengeDto {
  aid!: number;
  artikelId!: number;
  menge!: number;
  mhd!: Date;
  palete!: PALETTENTYP;
  liferant!: number;
}
