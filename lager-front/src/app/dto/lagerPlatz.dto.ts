export class LagerPlatztDto{

    id! : number;

    lagerplatz! : string;

    artId! : number;

    artikelMenge! : number;
    name!: string;

    einheit! : number;

    palettenTyp! : PALETTENTYP;

    mhd! : Date;

    lagerPlatzVolumen! : number;

    static : boolean = false;
    liferant!:number;
    proPalete! : number;
}
export enum PALETTENTYP{
  EU = 'EU',
  INDU = 'INDU',
  EINWEG = 'EINWEG',
  KEINPALETTE = 'KEINPALETTE'
}
