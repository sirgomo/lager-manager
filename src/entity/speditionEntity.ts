import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('spedition')
export class speditionEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
name : string;
@Column()
maxLadeGewicht : number;
@Column()
maxPalettenMenge : number;
}