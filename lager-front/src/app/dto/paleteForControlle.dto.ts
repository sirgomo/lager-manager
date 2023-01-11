import { PALETTENTYP } from './lagerPlatz.dto';

export class PaleteForControlleDto {
  autoid!: number;
  id!: number;
  palettenTyp!: PALETTENTYP;
  kontrolliert!: boolean;
  paletteRealGewicht!: number;
}
