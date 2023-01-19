/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
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
    kreditorId: number;
    @Column()
    eingebucht : boolean;
    @Column()
    bestellungId : number;
    @Column()
    artikelsGebucht: boolean = false;
    @PrimaryColumn({'nullable': false})
    lieferscheinNr:string;
    @Column('date',{'nullable': false})
    empfangDatum: Date;
    @Column({type : 'double', nullable: true})
    priceNetto: number;
    @Column({nullable: true})
    mehrwertsteuer:number;
 


}