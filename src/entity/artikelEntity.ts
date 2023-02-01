/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UiidEntity } from './uiidEntity';


@Entity('artikel')
export class ArtikelEntity {
  @PrimaryGeneratedColumn()
  aid:number;
  @Column({'nullable': false})
  artikelId: number;
  
  @Column()
  name: string;
  @Column({'nullable': true})
  name2: string;
  @Column({type: 'longtext', 'nullable':true})
  longBeschriftung:string;
 
  @Column()
  gewicht: number;
  @Column()
  grosse: string;
  @Column()
  basisEinheit: number;
  @Column()
  minLosMenge: number;
  @Column()
  artikelFlage: ARTIKELFLAGE;
  @Column()
  bestand: number;
  @Column({type : 'double', nullable: false})
  verPrice: number;
  @Column()
  liferantId: number;
  @Column({nullable: false})
  mehrwertsteuer:number;
  
  @OneToMany(()=> UiidEntity, (uid) => uid.arikels, {cascade: true})
  uids: UiidEntity[];
}
export enum ARTIKELFLAGE {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK'
}
