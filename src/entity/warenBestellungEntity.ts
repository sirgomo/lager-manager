import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bestellung')
export class WarenBestellungEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
kauferId : number;
@Column()
voraussichtlicheLieferDatum : Date;
@Column()
artid : number;
@Column()
menge : number;
@Column()
liefarantId:number;
@Column()
verkauferId:number;   

}