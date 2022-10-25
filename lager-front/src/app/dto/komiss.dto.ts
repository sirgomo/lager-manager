import { artikelDTO } from "./artikel.dto";

export class komissDTO{

  id! : number;

  verkauferId!: number;

  maxPalettenHoher! : number;

  gewunschtesLieferDatum! : Date;

  dispositorId! : number;

  kommissStatus!  : KOMMISIONSTATUS;

  spedition! : number;

  versorungId! : string;
  artikels!:artikelDTO[];
 // kommDetails! : kommisioDetailsEntity;
}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}
