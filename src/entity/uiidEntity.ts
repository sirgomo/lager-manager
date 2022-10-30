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
    @ManyToOne(()=> ArtikelEntity, (artikel) => artikel.uids)
    @JoinColumn({name: 'artikelId'})
    arikels : ArtikelEntity;
}