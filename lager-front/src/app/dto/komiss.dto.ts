import { KommissDetailsDto } from './kommissDetails.dto';

export class KomissDTO {
  id!: number;

  verkauferId!: number;

  maxPalettenHoher!: number;

  gewunschtesLieferDatum!: Date;

  dispositorId!: number;
  skonto!: number;
  skontoFrist!: number;
  kommissStatus!: KOMMISIONSTATUS;

  spedition!: number;

  versorungId!: string;
  kommDetails!: KommissDetailsDto[];
}
export enum KOMMISIONSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
  FREI = 'BEREIT',
  FERTIG = 'FERTIG',
  DRINGEND = 'DRINGEND',
}
