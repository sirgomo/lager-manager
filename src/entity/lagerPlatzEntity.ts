import { Column,  Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


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
    @Column({nullable: true,  type: 'date' })
    mhd : Date; 
    @Column()
    lagerPlatzVolumen : number;
    @Column({nullable: true})
    mengeProPalete : number;
    @Column()
    static : boolean = false;
    @Column({nullable: true})
    liferant:number;
    @Column({nullable: true})
    barcode: string;

  

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG',
    KEINPALETTE = 'KEINPALETTE'
}