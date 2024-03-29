import { ARTIKELFLAGE } from './artikel.dto';

export class ArtikelKommissDto {
  artId!: number;
  total!: number;
  name!: string;
  rabatt!: number;
  verPrice!: number;
  minLosMenge!: number;
  gewicht!: number;
  basisEinheit!: number;
  ARTIKELFLAGE!: ARTIKELFLAGE;
  fehlArtikelId!: number;
  fehlArtikelMenge!: number;
  resMenge!: number;
  liferantId!: number;
  logisticBelegNr!: string;
}
