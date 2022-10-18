import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('komissionirungen')
export class komissionirunEntity{
@PrimaryGeneratedColumn()
id : number;
@Column()
komissionierId : string;
@Column()
lkwMenge : number;
@Column()
artikelIdmenge : string;
@Column()
maxPalettenHöher : string;
@Column()
erwartetTotalGewicht : number;
@Column()
totalPalettenMenge : number;
@Column()
gewunschtesLieferDatum : Date;
@Column()
dispositorId : number;
@Column()
erleidigt : boolean = false;
@Column()
inKomissionirung : boolean = false;
@Column()
spedition : number;
@Column()
versorungId : string;
}