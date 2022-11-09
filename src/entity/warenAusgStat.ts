import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WarenAusgStat{
    @PrimaryGeneratedColumn()
    id: number;
    @PrimaryColumn()
    artikelId: number;
    @Column()
    menge: number;
    @Column()
    ausgangDatum: Date;
    @Column({type : 'double', nullable: false})
    price: number;
    @Column({type: 'double', nullable: false})
    verPrice: number;
}