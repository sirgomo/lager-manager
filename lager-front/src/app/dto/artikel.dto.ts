import { UidDTO } from "./uid.dto";

 export class ArtikelDTO{
    artikelId!: number;
    name!: string;
    uid!: UidDTO[];
    gewicht!: number;
    grosse!: string;
    basisEinheit!: number;
    minLosMenge!: number;
    durchschnittlicheLagerdauer!: number;
    umschlagshaufigkeit!: number;
    durschnittlicherLagerbestand!: number;
    artikelFlage!: artikelFlage;
 }
 export enum artikelFlage{
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
 }
