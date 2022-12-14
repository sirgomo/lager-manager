import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('spedition')
export class SpeditionEntity{
@PrimaryGeneratedColumn()
id : number;
@Column('text', {'nullable':false})
name : string;
@Column('text', {'nullable':true} )
name2:string;
@Column({ 'nullable': false})
maxLadeGewicht : number;
@Column({  'nullable': false})
maxPalettenMenge : number;
@Column('text', {'nullable': false})
stadt:string;
@Column('text', {'nullable': false})
strasseUndNr:string;
@Column('int', {'nullable': false})
postleitzahl :number;
@Column('text', {'nullable': false})
uStIdentifikationsnummer:string;
}