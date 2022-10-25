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

@OneToMany(()=> ArtikelEntity,
 (ArtikelEntity)=> ArtikelEntity.kommisioDetail, {cascade : true })
artikelList : ArtikelEntity[];

@OneToMany(()=> KommissionirungEntity, 
(KommissionirungEntity)=> KommissionirungEntity.kommDetails, {cascade: true})
kommlist : KommissionirungEntity[];

}
export enum ARTIKELSTATUS{
    INPACKEN = 'INPACKEN',
    GEPACKT = 'GEPACKT'
}