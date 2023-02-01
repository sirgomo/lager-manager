import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { KommissionirungEntity } from './kommissionirungEntity';

@Entity('kommDetails')
export class KommisioDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  artikelId: number;
  @Column({ nullable: true })
  kommissId: number;
  @Column({ nullable: true })
  menge: number;
  @Column({ type: 'double', nullable: false, default: 0 })
  rabatt = 0;
  @Column({ nullable: false, default: 0 })
  currentGepackt: number;
  @Column({ nullable: true })
  gepackt: ARTIKELSTATUS;
  @Column({ nullable: true })
  palettennr: number;
  @Column({ nullable: true })
  kreditorId: number;
  @Column()
  inBestellung: boolean;
  @Column({ nullable: false, type: 'varchar', width: 30 })
  logisticBelegNr: string;

  @ManyToOne(
    () => KommissionirungEntity,
    (KommissionirungEntity) => KommissionirungEntity.kommDetails,
    { onDelete: 'CASCADE', onUpdate: 'NO ACTION' },
  )
  kommlist: KommissionirungEntity;
}
export enum ARTIKELSTATUS {
  INPACKEN = 'INPACKEN',
  GEPACKT = 'GEPACKT',
  TEILGEPACKT = 'TEILGEPACKT',
}
