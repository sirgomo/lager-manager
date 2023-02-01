/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { PALETTENTYP } from './lagerPlatzEntity';

@Entity('inKomissPal')
export class InKomissPalletenEntity {
  @PrimaryGeneratedColumn()
  autoid:number;
  @Column()
  id : number = 0;
  @Column()
  artikelId:number = 0;
  @Column()
  artikelMenge:number=0;
  @Column({nullable: false})
  liferantId:number;
  @Column()
  palettenTyp : PALETTENTYP
  @Column()
  palettenVolumen : number =0;
  @PrimaryColumn()
  kommId : number=-1;
  @Column()
  lkwNummer : number=-1;
  @Column()
  inPaken : boolean = false;
  @Column()
  kontrolliert : boolean = false;
  @Column()
  fertig : boolean = false;
  @Column()
  erwartetPaletteGewicht : number =0;
  @Column()
  paletteRealGewicht : number=0;
  @Column()
  userId : number;
  @Column()
  gepackt : boolean = false;
  @Column()
  palettenH:number=0;
}
