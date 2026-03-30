import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { Truck } from './truck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck])],
  controllers: [TruckController],
  providers: [TruckService],
})
export class TruckModule {}
