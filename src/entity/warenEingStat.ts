import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WarenEingStat{
    @PrimaryGeneratedColumn()
    id: number;
    @PrimaryColumn({'nullable': false})
    artikelId: number;
    @Column({'nullable':false})
    menge: number;
    @Column({'nullable':false})
    bezeichnung:string; 
    @Column('date',{'nullable': false})
    empfangDatum: Date;
    @Column('date',{'nullable': false})
    versandDatum: Date;
    @Column({type : 'double', nullable: false})
    price: number;
    @Column({type : 'double', nullable: false})
    lieferandId: number;
    @Column({'nullable': false})
    lieferscheinNr:string;
}