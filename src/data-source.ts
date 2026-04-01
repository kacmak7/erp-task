import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { baseDbConfig } from './database.config';

export default new DataSource({
  ...baseDbConfig,
  migrations: ['src/migrations/*.ts'],
});
