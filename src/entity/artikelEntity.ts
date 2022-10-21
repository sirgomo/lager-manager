import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { kommisioDetailsEntity } from './kommisioDetailsEntity';


@Entity('artikel')
export class artikelEntity {
  @PrimaryGeneratedColumn()
  artikelId: number;
  @PrimaryColumn()
  name: string;
  @PrimaryColumn()
  uid: string;
  @Column()
  gewicht: number;
  @Column()
  grosse: string;
  @Column()
  basisEinheit: number;
 
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
  @Column()
  bestand: number;
  @ManyToOne(()=> kommisioDetailsEntity, (kommisioDetail)=> kommisioDetail.artikelList )
  kommisioDetail : kommisioDetailsEntity;
  
}
export enum artikelFlage {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
}
