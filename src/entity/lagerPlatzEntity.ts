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
    proPalete : number;
    @Column()
    static : boolean = false;
    @Column({nullable: false})
    liferant:number;

  

}
export enum PALETTENTYP{
    EU = 'EU',
    INDU = 'INDU',
    EINWEG = 'EINWEG',
    KEINPALETTE = 'KEINPALETTE'
}