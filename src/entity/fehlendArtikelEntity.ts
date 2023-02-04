import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('artfehlend')
export class FehlendArtikelEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
artikelid : number;
@Column()
menge : number;

}