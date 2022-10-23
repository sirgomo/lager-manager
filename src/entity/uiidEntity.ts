import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn  } from "typeorm";
import { artikelEntity } from "./artikelEntity";

@Entity('uiids')
export class uiidEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @PrimaryColumn()
    uid : string;
    @PrimaryColumn()
    artikelId : number;
    @ManyToOne(()=> artikelEntity, (artikel) => artikel.uids)
    @JoinColumn({name: 'artikelId'})
    arikels : artikelEntity;
}