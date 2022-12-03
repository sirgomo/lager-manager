 export class ArtikelDTO{
    artikelId!: number;
    name!: string;
    uids!: UidDTO[];
    gewicht!: number;
    grosse!: string;
    basisEinheit!: number;
    minLosMenge!: number;
    bestand!: number;
    ARTIKELFLAGE!: ARTIKELFLAGE;
    artikelPrice!: number;
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
