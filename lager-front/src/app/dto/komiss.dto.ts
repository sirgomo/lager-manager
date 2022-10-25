import { ArtikelDTO } from "./artikel.dto";

export class KomissDTO{

  id! : number;

  verkauferId!: number;

  maxPalettenHoher! : number;

  gewunschtesLieferDatum! : Date;

  dispositorId! : number;

  kommissStatus!  : KOMMISIONSTATUS;

  spedition! : number;

  versorungId! : string;
  artikels!:ArtikelDTO[];
 // kommDetails! : KommisioDetailsEntity;
}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}
