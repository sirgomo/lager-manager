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
    artId : number;
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
    static : boolean;
    @Column({nullable: true})
    liferant:number;
    @Column({nullable: true, type: 'varchar', unique: true})
    barcode: string;
    @Column({nullable: false, type: 'tinyint', default: 0})
    prufziffern: number;
    @Column({nullable: false, type: 'tinyint', default : 0})
    gesperrt: boolean;
    @Column({nullable: false, type: 'tinyint', default: 0})
    lagerid: number
    @Column({nullable: false, type: 'varchar', default: 'lager'}) 
    lagerName: string;
  

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG',
    KEINPALETTE = 'KEINPALETTE',
    KARTON = 'KARTON'
}