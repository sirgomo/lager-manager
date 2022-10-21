import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { artikelEntity } from "./artikelEntity";
import { kommissionirungEntity } from "./kommissionirungEntity";

@Entity('kommDetails')
export class kommisioDetailsEntity{
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

@OneToMany(()=> artikelEntity,
 (artikelEntity)=> artikelEntity.kommisioDetail, {cascade : true })
artikelList : artikelEntity[];

@OneToMany(()=> kommissionirungEntity, 
(kommissionirungEntity)=> kommissionirungEntity.kommDetails, {cascade: true})
kommlist : kommissionirungEntity[];

}
export enum ARTIKELSTATUS{
    INPACKEN = 'INPACKEN',
    GEPACKT = 'GEPACKT'
}