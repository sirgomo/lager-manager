import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class artikelEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  uid: string;
  @Column()
  gewicht: number;
  @Column()
  grosse: string;
  @Column()
  basisEinheit: number;
  @Column()
  mhd: Date;
  @Column()
  minLosMenge: number;
  @Column()
  durchschnittlicheLagerdauer: number;
  @Column()
  umschlagshaufigkeit: number;
  @Column()
  durschnittlicherLagerbestand: number;
  @Column()
  artikelFlage: artikelFlage;
}
export enum artikelFlage {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
}
