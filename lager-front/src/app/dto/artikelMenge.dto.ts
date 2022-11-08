import { PALETTENTYP } from "./lagerPlatz.dto";

export class ArtikelMengeDto{
  artikelId!:number;
  menge!: number;
  mhd!: Date;
  palete!:PALETTENTYP;
}
