export class LagerPlatztDto{

    id! : number;

    lagerplatz! : string;

    artId! : number;

    artikelMenge! : number;

    einheit! : number;

    palettenTyp! : PALETTENTYP;

    mhd! : Date;

    lagerPlatzVolumen! : number;

    static : boolean = false;
}
export enum PALETTENTYP{
  EU = 'EU',
  INDU = 'INDU',
  EINWEG = 'EINWEG',
  KEINPALETTE = 'KEINPALETTE'
}
