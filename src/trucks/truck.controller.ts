import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TruckService } from './truck.service';
import { CreateTruckDto, UpdateTruckDto, TruckQueryDto, UpdateTruckStatusDto } from './truck.schema';

@Controller('trucks')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Get()
  findAll(@Query() query: TruckQueryDto) {
    return this.truckService.findAll(query);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.truckService.findOne(code);
  }

  @Post()
  create(@Body() dto: CreateTruckDto) {
    return this.truckService.create(dto);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() dto: UpdateTruckDto) {
    return this.truckService.update(code, dto);
  }

  @Patch(':code/status')
  updateStatus(@Param('code') code: string, @Body() dto: UpdateTruckStatusDto) {
    return this.truckService.updateStatus(code, dto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('code') code: string) {
    return this.truckService.remove(code);
  }
}
