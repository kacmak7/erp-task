import { Entity, Column, PrimaryColumn } from 'typeorm';
import type { TruckStatus } from './truck.schema';

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
