import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('warenEingang')
export class WarenEingangEntity{
    @PrimaryGeneratedColumn()
    id : number
    @Column()
    artikelid : number;
    @Column()
    menge : number;
    @Column()
    tor : string;
    @Column()
    eingelagert : boolean;
}