import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('dispositor')
export class DispositorEntity {
  @PrimaryGeneratedColumn()
  id:number;
  @Column('text', {'nullable':false} )
  name:string;
  @Column('text', {'nullable':true} )
  name2:string;
  @Column('text', {'nullable': false})
  stadt:string;
  @Column('text', {'nullable': false})
  strasseUndNr:string;
  @Column('int', {'nullable': false})
  postleitzahl :number;
  @Column('text', {'nullable': false})
  uStIdentifikationsnummer:string;
}
