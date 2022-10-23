 export class artikelDTO{
    id!: number;
    name!: string;
    uid!: string;
    gewicht!: number;
    grosse!: string;
    basisEinheit!: number;
    mhd!: string;
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
