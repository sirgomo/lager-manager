import { ARTIKELFLAGE } from "./artikel.dto";

export class ArtikelKommissDto{
  artId!:number;
  total!: number;
  name!: string;
  artikelPrice!: number;
  verPrice!:number;
  minLosMenge!:number;
  gewicht!:number;
  basisEinheit!:number;
  ARTIKELFLAGE!:ARTIKELFLAGE;
  fehlArtikelId!:number;
  fehlArtikelMenge!: number;
  resMenge!:number;
  liferantId!:number;
  logisticBelegNr!:string;
}
