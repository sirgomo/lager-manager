import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PALETTENTYP } from "./lagerPlatzEntity";

@Entity('inKomissPal')
export class inKomissPalletenEntity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    artikelIdMengeName : string;
    @Column()
    palettenTyp : PALETTENTYP
    @Column()
    palettenVolumen : number;
    @Column()
    kommId : number;
    @Column()
    lkwNummer : number;
    @Column()
    inPaken : boolean = false;
    @Column()
    kontrolliert : boolean = false;
    @Column()
    fertig : boolean = false;
    @Column()
    erwartetPaletteGewicht : number;
    @Column()
    paletteRealGewicht : number;
    @Column()
    userId : number;
    @Column()
    gepackt : boolean = false;
}

