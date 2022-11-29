import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class UserEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column({'nullable': false})
  vorname:string;
  @Column({'nullable': false})
  nachname:string;
  @PrimaryColumn({'nullable': false})
  username: string;
  @Column({'nullable': false})
  userpassword: string;
  @Column({'nullable': false})
  salt: string;
  @Column({'nullable': false})
  role: string;
}
export enum ROLE{
    KOMMISIONIER = 'KOMMISIONIER',
    KONTROLLER = 'KONTROLLER',
    WARENPFHLEGE = 'WARENPFHLEGE',
    WARENEINGANG = 'WARENEINGANG',
    LAGERVERWALTUNG = 'LAGERVERWALTUNG',
    ADMIN = 'ADMIN',
    KAUF = 'KAUF',
    VERKAUF = 'VERKAUF'
}