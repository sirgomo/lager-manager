import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('artFehlend')
export class FehlendArtikelEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
artikelid : number;
@Column()
menge : number;

}