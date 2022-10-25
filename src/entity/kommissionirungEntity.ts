import { Column, Entity,  ManyToOne,  PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { DispoEntity } from "./DispoEntity";
import { KommisioDetailsEntity } from "./KommisioDetailsEntity";
import { SpeditionEntity } from "./SpeditionEntity";

@Entity('kommissionirungen')
export class KommissionirungEntity{
@PrimaryGeneratedColumn()
id : number;
@PrimaryColumn()
verkauferId : number;

@Column()
maxPalettenHöher : number;
@Column()
gewunschtesLieferDatum : Date;
@Column()
dispositorId : number;

@Column()
kommissStatus  : KOMMISIONSTATUS;
@PrimaryColumn()
spedition : number;
@Column()
versorungId : string;


@ManyToOne(()=> KommisioDetailsEntity, (kommisioDetails) => kommisioDetails.kommlist)
kommDetails : KommisioDetailsEntity;

}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}