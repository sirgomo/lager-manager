import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('artReservation')
export class artikelReservationEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    kommId : number;
    @Column()
    artikelId : number;
    @Column()
    menge : number;
}