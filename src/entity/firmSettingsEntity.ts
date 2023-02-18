import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('firmSettings')
export class FirmSettingsEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 255, nullable: false})
    rfirmname: string;
    @Column({type: 'varchar', length: 255, nullable: false})
    rname: string;
    @Column({type: 'varchar', length: 255, nullable: true})
    rstrasse: string;
    @Column({type: 'smallint', nullable: false})
    rhausnr: number;
    @Column({type: 'varchar', length: 255, nullable: false})
    rstadt: string;  
    @Column({type: 'mediumint', nullable: false})
    rpostleitzahl: number;  
    @Column({type: 'varchar', length: 255, nullable: true})
    lfirmname: string;
    @Column({type: 'varchar', length: 255, nullable: true})
    lname: string;
    @Column({type: 'varchar', length: 255, nullable: true})
    lstrasse: string;
    @Column({type: 'smallint', nullable: true})
    lhausnr: number;
    @Column({type: 'varchar', length: 255, nullable: true})
    lstadt: string;  
    @Column({type: 'mediumint', nullable: true})
    lpostleitzahl: number; 
    @Column({type: 'varchar', length: 20, nullable: false})
    steuernummer: string;
    @Column({type: 'varchar', length: 20, nullable: true})
    steuerid: string;
    @Column({type: 'varchar', length: 20, nullable: true})
    ustid: string;
}