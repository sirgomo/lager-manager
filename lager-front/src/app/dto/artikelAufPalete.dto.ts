import { PALETTENTYP } from "./lagerPlatz.dto";

export class ArtikelAufPaletteDto{
  paletteid!:number;
  kommissId!:number;
  artikelMenge!:number;
  artid!:number;
  palTyp!: PALETTENTYP;
  kommissionierId!: number;
}
