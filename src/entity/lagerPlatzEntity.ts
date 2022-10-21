import { Column, DataSource, Double, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { artikelEntity } from "./artikelEntity";

@Entity('lagerplatz')
export class lagerPlatzEntity{
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

    @ManyToMany(()=> artikelEntity)
    @JoinColumn()
    artikel: artikelEntity[];

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG'
}