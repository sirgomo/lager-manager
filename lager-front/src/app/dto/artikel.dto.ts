 export class ArtikelDTO{
    artikelId!: number;
    name!: string;
    uids!: UidDTO[];
    gewicht!: number;
    grosse!: string;
    basisEinheit!: number;
    minLosMenge!: number;
    durchschnittlicheLagerdauer!: number;
    umschlagshaufigkeit!: number;
    durschnittlicherLagerbestand!: number;
    artikelFlage!: artikelFlage;
    artikelPrice!: number;
 }
 export enum artikelFlage{
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
 }
 export class UidDTO{
  id!:number;
  uid!:string;
  artikelId!: number;
}
