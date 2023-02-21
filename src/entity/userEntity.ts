import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  vorname: string;
  @Column({ nullable: false })
  nachname: string;
  @Column({ nullable: false })
  username: string;
  @Column({ nullable: false })
  userpassword: string;
  @Column({ nullable: false })
  salt: string;
  @Column({ nullable: false })
  role: ROLE;
}
export enum ROLE {
  KOMMISIONIER = 'KOMMISIONIER',
  KONTROLLER = 'KONTROLLER',
  DATAPFHLEGE = 'DATAPFHLEGE',
  WARENEINGANG = 'WARENEINGANG',
  LAGERVERWALTUNG = 'LAGERVERWALTUNG',
  ADMIN = 'ADMIN',
  KAUF = 'KAUF',
  VERKAUF = 'VERKAUF',
  WAUSGANG = 'WAUSGANG',
}
