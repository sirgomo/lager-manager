import { Column, Entity,  ManyToOne,  PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { dispoEntity } from "./dispoEntity";
import { kommisioDetailsEntity } from "./kommisioDetailsEntity";
import { speditionEntity } from "./speditionEntity";

@Entity('kommissionirungen')
export class kommissionirungEntity{
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


@ManyToOne(()=> kommisioDetailsEntity, (kommisioDetails) => kommisioDetails.kommlist)
kommDetails : kommisioDetailsEntity;

}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}