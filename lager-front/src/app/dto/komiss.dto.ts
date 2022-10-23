export class komissDTO{

  id! : number;

  verkauferId!: number;

  maxPalettenHoher! : number;

  gewunschtesLieferDatum! : Date;

  dispositorId! : number;

  kommissStatus!  : KOMMISIONSTATUS;

  spedition! : number;

  versorungId! : string;
 // kommDetails! : kommisioDetailsEntity;
}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}
