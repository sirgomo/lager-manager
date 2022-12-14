 export class ArtikelDTO{
    aid!:number;
    artikelId!: number;
    name!: string;
    name2!: string;
    longBeschriftung!:string;
    uids!: UidDTO[];
    gewicht!: number;
    grosse!: string;
    basisEinheit!: number;
    minLosMenge!: number;
    bestand!: number;
    ARTIKELFLAGE!: ARTIKELFLAGE;
    verPrice2!: number;
    verPrice!: number;
    mehrwertsteuer!: number;
    liferantId!: number;
 }
 export enum ARTIKELFLAGE{
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
 }
 export class UidDTO{
  id!:number;
  uid!:string;
  artikelId!: number;
}
