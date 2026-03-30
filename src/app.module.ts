import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TruckModule } from './trucks/truck.module';
import { Truck } from './trucks/truck.entity';
import { InitTrucks1774656000000 } from './migrations/1774656000000-InitTrucks';
import { AddTruckDescription1774828800000 } from './migrations/1774828800000-AddTruckDescription';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'imagesdb',
      entities: [Truck],
      synchronize: false,
      migrations: [InitTrucks1774656000000, AddTruckDescription1774828800000],
      migrationsRun: true,
    }),
    TruckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
