import { PALETTENTYP } from './lagerPlatz.dto';

export class NeuePaletteDto {
  palid!: number;
  kommId!: number;
  palTyp!: PALETTENTYP;
  kommissionierId!: number;
  gewicht!: number;
}
