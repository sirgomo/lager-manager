import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ArtikelEntity } from "./ArtikelEntity";
import { KommissionirungEntity } from "./KommissionirungEntity";

@Entity('kommDetails')
export class KommisioDetailsEntity{
@PrimaryGeneratedColumn()
id : number;
@Column({nullable: true})
artikelId : number;
@Column({nullable: true})
kommissId : number;
@Column({nullable: true})
menge: number;
@Column({nullable: true})
gepackt : ARTIKELSTATUS;
@Column({nullable: true})
palettennr : number;
@Column()
inBestellung:boolean;
@Column({nullable: false, type: 'varchar', width: 30})
logisticBelegNr:string


@ManyToOne(()=> KommissionirungEntity, 
(KommissionirungEntity)=> KommissionirungEntity.kommDetails, {onDelete: "CASCADE"})
kommlist : KommissionirungEntity;

}
export enum ARTIKELSTATUS{
    INPACKEN = 'INPACKEN',
    GEPACKT = 'GEPACKT'
}