import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class dispoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  anschrift: string;
}
