import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { ArtikelEntity } from "./ArtikelEntity";

@Entity('uiids')
export class UiidEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    uid : string;
    @Column()
    artikelId : number;
    @Column()
    aid:number;
    @ManyToOne(()=> ArtikelEntity, (ArtikelEntity) => ArtikelEntity.uids, {onDelete:'CASCADE', onUpdate: 'NO ACTION'})
    @JoinColumn({name: 'aid'})
    arikels : ArtikelEntity;
}