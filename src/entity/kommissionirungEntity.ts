import { Column, Entity,  ManyToOne,  OneToMany,  PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { KommisioDetailsEntity } from "./KommisioDetailsEntity";
import { SpeditionEntity } from "./SpeditionEntity";

@Entity('kommissionirungen')
export class KommissionirungEntity{
@PrimaryGeneratedColumn()
id : number;
@PrimaryColumn()
verkauferId : number;

@Column()
maxPalettenHoher : number;
@Column({ type: 'date' })
gewunschtesLieferDatum : Date;
@Column()
dispositorId : number;

@Column()
kommissStatus  : KOMMISIONSTATUS;
@PrimaryColumn()
spedition : number;
@Column()
versorungId : string;


@OneToMany(()=> KommisioDetailsEntity, (kommisioDetails) => kommisioDetails.kommlist, {cascade: true})
kommDetails : KommisioDetailsEntity[];

}
export enum KOMMISIONSTATUS{
    INBEARBEITUNG = 'INBEARBEITUNG',
    INKOMMISSIONIRUNG = 'INKOMMISSIONIRUNG',
    FREI = 'BEREIT',
    FERTIG = 'FERTIG'
}