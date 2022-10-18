import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('paletten')
export class palettenEnttity{
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    paletteId : number;
    @Column()
    artikelIdmengeName : string;
    @Column()
    kommId : number;

}