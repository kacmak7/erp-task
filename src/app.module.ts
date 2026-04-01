import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TruckModule } from './trucks/truck.module';
import { baseDbConfig } from './database.config';
import { InitTrucks1774656000000 } from './migrations/1774656000000-InitTrucks';
import { AddTruckDescription1774828800000 } from './migrations/1774828800000-AddTruckDescription';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...baseDbConfig,
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
