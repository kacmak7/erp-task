import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Truck } from './trucks/truck.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'imagesdb',
  entities: [Truck],
  migrations: ['src/migrations/*.ts'],
});
