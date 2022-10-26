import { Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { KommisioDetailsEntity } from './KommisioDetailsEntity';
import { UiidEntity } from './UiidEntity';


@Entity('artikel')
export class ArtikelEntity {
  @PrimaryGeneratedColumn()
  artikelId: number;
  
  @Column()
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
  @ManyToOne(()=> KommisioDetailsEntity, (kommisioDetail)=> kommisioDetail.artikelList )
  kommisioDetail : KommisioDetailsEntity;
  
  @OneToMany(()=> UiidEntity, (uid) => uid.arikels, {cascade:[ "insert", "update"] })
  uids: UiidEntity[];
}
export enum artikelFlage {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK',
}
