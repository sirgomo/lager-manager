import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vorschlags')
export class VorschlagEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'mediumtext' })
  vorschlag: string;
  @Column({ type: 'text', nullable: true })
  name: string;
  @Column()
  erledigt: boolean;
}
