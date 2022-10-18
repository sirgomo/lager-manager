import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bestellung')
export class warenBestellungEntity{
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
}