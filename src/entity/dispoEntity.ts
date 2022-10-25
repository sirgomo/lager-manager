import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('dispositors')
export class DispoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  anschrift: string;
}
