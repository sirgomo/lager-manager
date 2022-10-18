import { Column, DataSource, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    mhd = Date; 
    @Column()
    lagerPlatzVolumen : number;
    @Column()
    static : boolean = false;

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG'
}