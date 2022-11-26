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
  artikelFlage: ARTIKELFLAGE;
  @Column()
  bestand: number;
  @Column({type : 'double', nullable: false})
  artikelPrice : number;
  @Column({type: 'double', nullable: false})
  verPrice: number;
  @Column()
  liferantId: number;
  @Column({nullable: false})
  mehrwertsteuer:number;
  
  @OneToMany(()=> UiidEntity, (uid) => uid.arikels)
  uids: UiidEntity[];
}
export enum ARTIKELFLAGE {
  FASS = 'FASS',
  SUSS = 'SUSS',
  ALK = 'ALK'
}
