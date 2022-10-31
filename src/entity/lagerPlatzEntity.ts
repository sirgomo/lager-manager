import { Column, DataSource, Double, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtikelEntity } from "./ArtikelEntity";

@Entity('lagerplatz')
export class LagerPlatzEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    lagerplatz : string;
    @Column({nullable: true})
    artId : number;
    @Column({nullable: true})
    artikelMenge : number;
    @Column({nullable: true})
    einheit : number;
    @Column({nullable: true})
    palettenTyp : PALETTENTYP;
    @Column({nullable: true})
    mhd : Date; 
    @Column()
    lagerPlatzVolumen : number;
    @Column()
    static : boolean = false;

  

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG',
    KEINPALETTE = 'KEINPALETTE'
}