import { uidDTO } from "./uid.dto";

 export class artikelDTO{
    artikelId!: number;
    name!: string;
    uid!: uidDTO[];
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
