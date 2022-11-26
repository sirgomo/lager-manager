import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('liferants')
export class Liferants{
@PrimaryGeneratedColumn()
id:number;
@Column('text', {'nullable':false} )
name:string;
@Column('text', {'nullable': false})
stadt:string;
@Column('text', {'nullable': false})
strasseUndNr:string;
@Column('int', {'nullable': false})
postleitzahl :number;
@Column('tinytext', {'nullable': false})
uStIdentifikationsnummer:string;

}