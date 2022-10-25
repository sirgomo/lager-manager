import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { ArtikelEntity } from "./ArtikelEntity";

@Entity('uiids')
export class UiidEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @PrimaryColumn()
    uid : string;
    @PrimaryColumn()
    artikelId : number;
    @ManyToOne(()=> ArtikelEntity, (artikel) => artikel.uids)
    @JoinColumn({name: 'artikelId'})
    arikels : ArtikelEntity;
}