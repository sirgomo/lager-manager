import { ArtikelDTO } from './artikel.dto';
import { KommissDetailsDto } from './kommissDetails.dto';

export class KomissDTO {
  id!: number;

  verkauferId!: number;

  maxPalettenHoher!: number;

  gewunschtesLieferDatum!: Date;

  dispositorId!: number;

  kommissStatus!: KOMMISIONSTATUS;

  spedition!: number;

  versorungId!: string;
  artikels!: ArtikelDTO[];
  kommDetails!: KommissDetailsDto[];
}
export enum KOMMISIONSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
  FREI = 'BEREIT',
  FERTIG = 'FERTIG',
}
