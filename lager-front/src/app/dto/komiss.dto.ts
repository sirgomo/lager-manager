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
  versorgungId!: string;
  buchungsDatum!: Date;
  falligkeitDatum!: Date;
  kommDetails!: KommissDetailsDto[];
}
export enum KOMMISIONSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
  FREIGEGEBEN = 'FREIGEGEBEN',
  FERTIG = 'FERTIG',
  DRINGEND = 'DRINGEND',
}
