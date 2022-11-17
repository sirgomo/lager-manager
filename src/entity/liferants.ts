import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('liferants')
export class Liferants{
@PrimaryGeneratedColumn()
id:number;
@Column('text', {'nullable':false} )
name:string;
@Column('text', {'nullable': false})
anschirft:string;
}