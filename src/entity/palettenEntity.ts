import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paletten')
export class PalettenEnttity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    paletteId : number;
    @Column()
    artikelIdmengeName : string;
    @Column()
    kommId : number;

}