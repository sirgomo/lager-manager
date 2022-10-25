import { Column, DataSource, Double, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtikelEntity } from "./ArtikelEntity";

@Entity('lagerplatz')
export class LagerPlatzEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    lagerplatz : string;
    @Column()
    artId : number;
    @Column()
    artikelMenge : number;
    @Column()
    einheit : number;
    @Column()
    palettenTyp : PALETTENTYP;
    @Column()
    leer : boolean = false;
    @Column()
    mhd : Date; 
    @Column()
    lagerPlatzVolumen : number;
    @Column()
    static : boolean = false;

    @ManyToMany(()=> ArtikelEntity)
    @JoinColumn()
    artikel: ArtikelEntity[];

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG'
}