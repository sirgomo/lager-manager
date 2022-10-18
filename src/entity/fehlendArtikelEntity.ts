import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('artFehlend')
export class fehlendArtikelEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
artikelid : number;
@Column()
menge : number;
@Column()
name : string;
}