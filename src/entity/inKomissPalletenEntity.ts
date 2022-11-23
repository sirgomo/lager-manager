import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { PALETTENTYP } from "./LagerPlatzEntity";

@Entity('inKomissPal')
export class InKomissPalletenEntity{
    @Column()
    id : number = 0;
    @Column()
    artikelId:number = 0;
    @Column()
    artikelMenge:number=0;
    @Column()
    artikelName:string='';
    @Column()
    palettenTyp : PALETTENTYP
    @Column()
    palettenVolumen : number =0;
    @PrimaryColumn()
    kommId : number=-1;
    @Column()
    lkwNummer : number=-1;
    @Column()
    inPaken : boolean = false;
    @Column()
    kontrolliert : boolean = false;
    @Column()
    fertig : boolean = false;
    @Column()
    erwartetPaletteGewicht : number =0;
    @Column()
    paletteRealGewicht : number=0;
    @Column()
    userId : number;
    @Column()
    gepackt : boolean = false;
    @Column()
    palettenH:number=0;
}   

