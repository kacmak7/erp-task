import { Entity, Column, PrimaryColumn } from 'typeorm';

export type TruckStatus =
  | 'Out Of Service'
  | 'Loading'
  | 'To Job'
  | 'At Job'
  | 'Returning';

@Entity('trucks')
export class Truck {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @Column({ default: 'Out Of Service' })
  status: TruckStatus;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;
}
