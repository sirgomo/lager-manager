/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import { Column,  Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('lagerplatz')
export class LagerPlatzEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    lagerplatz : string;
    @Column({nullable: true})
    artId : number = null;
    @Column({nullable: true})
    artikelMenge : number = null;
    @Column({nullable: true})
    einheit : number=null;
    @Column({nullable: true})
    palettenTyp : PALETTENTYP;
    @Column({nullable: true,  type: 'date' })
    mhd : Date = null; 
    @Column()
    lagerPlatzVolumen : number;
    @Column({nullable: true})
    mengeProPalete : number;
    @Column()
    static : boolean = false;
    @Column({nullable: true})
    liferant:number;
    @Column({nullable: true, type: 'tinytext', unique: true})
    barcode: string;
    @Column({nullable: false, type: 'tinyint'})
    prufziffern: number;

  

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG',
    KEINPALETTE = 'KEINPALETTE',
    KARTON = 'KARTON'
}