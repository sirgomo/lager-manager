import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { kommisioDetailsEntity } from './kommisioDetailsEntity';
import { uiidEntity } from './uiidEntity';


@Entity('artikel')
export class artikelEntity {
  @PrimaryGeneratedColumn()
  artikelId: number;
  
  @PrimaryColumn()
  name: string;
 
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
  
  @OneToMany(()=> uiidEntity, (uid) => uid.arikels, {cascade:[ "insert", "update"] })
  uids: uiidEntity[];
}
export enum artikelFlage {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
}
