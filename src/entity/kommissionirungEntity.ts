import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { KommisioDetailsEntity } from './KommisioDetailsEntity';

@Entity('kommissionierung')
export class KommissionirungEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryColumn()
  verkauferId: number;

  @Column()
  maxPalettenHoher: number;
  @Column({ type: 'date' })
  gewunschtesLieferDatum: Date;
  @Column()
  dispositorId: number;
  @Column({ type: 'tinyint', default: 0 })
  skonto: number;
  @Column({ type: 'smallint', default: 0 })
  skontoFrist: number;
  @Column()
  kommissStatus: KOMMISIONSTATUS;
  @Column()
  spedition: number;
  @Column()
  versorungId: string;

  @OneToMany(
    () => KommisioDetailsEntity,
    (kommisioDetails) => kommisioDetails.kommlist,
    { cascade: true },
  )
  kommDetails: KommisioDetailsEntity[];
}
export enum KOMMISIONSTATUS {
  INBEARBEITUNG = 'INBEARBEITUNG',
  INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
  FREI = 'BEREIT',
  FERTIG = 'FERTIG',
  DRINGEND = 'DRINGEND',
}
