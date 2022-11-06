import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('warenEingang')
export class WarenEingangEntity{
    @PrimaryGeneratedColumn()
    id : number
    @Column({nullable: true})
    artikelid : number;
    @Column({nullable: true})
    menge : number;
    @Column()
    tor : string;
    @Column()
    dispositorId: number;
    @Column()
    eingebucht : boolean;
    @PrimaryColumn()
    bestellungId : number;
    @Column()
    artikelsGebucht: boolean = false;
}