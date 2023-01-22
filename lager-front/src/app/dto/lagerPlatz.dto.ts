export class LagerPlatztDto {
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
}
export enum PALETTENTYP {
  EU = 'EU',
  INDU = 'INDU',
  EINWEG = 'EINWEG',
  KEINPALETTE = 'KEINPALETTE',
}
