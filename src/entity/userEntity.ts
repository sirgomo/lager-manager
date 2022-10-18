import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class userEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column()
  userpassword: string;
  @Column()
  salt: string;
  @Column()
  role: string;
}
export enum ROLE{
    KOMMISIONIER = 'KOMMISIONIER',
    KONTROLLER = 'KONTROLLER',
    WARENPFHLEGE = 'WARENPFHLEGE',
    ADMIN = 'ADMIN',
    KAUF = 'KAUF',
    VERKAUF = 'VERKAUF'
}