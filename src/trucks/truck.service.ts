import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Truck, TruckStatus } from './truck.entity';
import { CreateTruckDto, UpdateTruckDto, TruckQueryDto, UpdateTruckStatusDto } from './truck.schema';

const ALLOWED_TRANSITIONS: Record<TruckStatus, TruckStatus[]> = {
  'Out Of Service': ['Loading', 'To Job', 'At Job', 'Returning', 'Out Of Service'],
  'Loading': ['To Job', 'Out Of Service'],
  'To Job': ['At Job', 'Out Of Service'],
  'At Job': ['Returning', 'Out Of Service'],
  'Returning': ['Loading', 'Out Of Service'],
};

@Injectable()
export class TruckService {
  constructor(
    @InjectRepository(Truck)
    private readonly repo: Repository<Truck>,
  ) {}

  findAll(query: TruckQueryDto): Promise<Truck[]> {
    return this.repo.find({
      where: query.search
        ? [
            { code: ILike(`%${query.search}%`) },
            { name: ILike(`%${query.search}%`) },
          ]
        : undefined,
      order: { [query.sortBy]: query.sortOrder.toUpperCase() },
    });
  }

  async findOne(code: string): Promise<Truck> {
    const truck = await this.repo.findOneBy({ code });
    if (!truck) throw new NotFoundException(`Truck '${code}' not found`);
    return truck;
  }

  async create(dto: CreateTruckDto): Promise<Truck> {
    const exists = await this.repo.existsBy({ code: dto.code });
    if (exists) throw new ConflictException(`Truck with code '${dto.code}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(code: string, dto: UpdateTruckDto): Promise<Truck> {
    const truck = await this.findOne(code);
    return this.repo.save({ ...truck, ...dto });
  }

  async remove(code: string): Promise<void> {
    const truck = await this.findOne(code);
    await this.repo.remove(truck);
  }

  async updateStatus(code: string, dto: UpdateTruckStatusDto): Promise<Truck> {
    const truck = await this.findOne(code);
    if (!ALLOWED_TRANSITIONS[truck.status].includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from '${truck.status}' to '${dto.status}'`,
      );
    }
    return this.repo.save({ ...truck, status: dto.status });
  }
}
