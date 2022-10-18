import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('dispositors')
export class dispoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  anschrift: string;
}
