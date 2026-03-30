import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { TruckController } from './truck.controller';
import { TruckService } from './truck.service';
import { Truck } from './truck.entity';

const makeTruck = (overrides: Partial<Truck> = {}): Truck => ({
  code: 'ABC123',
  name: 'Test Truck',
  status: 'Out Of Service',
  description: null,
  ...overrides,
});

describe('TruckController', () => {
  let controller: TruckController;
  let service: jest.Mocked<TruckService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TruckController],
      providers: [
        {
          provide: TruckService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(TruckController);
    service = module.get(TruckService);
  });

  describe('GET /trucks', () => {
    it('returns list of trucks', async () => {
      const trucks = [makeTruck(), makeTruck({ code: 'XYZ999' })];
      service.findAll.mockResolvedValue(trucks);

      const result = await controller.findAll({ search: undefined, sortBy: 'code', sortOrder: 'asc' });

      expect(result).toBe(trucks);
    });
  });

  describe('GET /trucks/:code', () => {
    it('returns the truck', async () => {
      const truck = makeTruck();
      service.findOne.mockResolvedValue(truck);

      const result = await controller.findOne('ABC123');

      expect(result).toBe(truck);
    });

    it('returns 404 when truck not found', async () => {
      service.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('MISSING')).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /trucks', () => {
    it('creates and returns a new truck', async () => {
      const truck = makeTruck();
      service.create.mockResolvedValue(truck);

      const result = await controller.create({ code: 'ABC123', name: 'Test Truck' });

      expect(result).toBe(truck);
    });

    it('returns 409 when code already exists', async () => {
      service.create.mockRejectedValue(new ConflictException());

      await expect(controller.create({ code: 'ABC123', name: 'Test Truck' })).rejects.toThrow(ConflictException);
    });
  });

  describe('PATCH /trucks/:code', () => {
    it('updates and returns the truck', async () => {
      const truck = makeTruck({ name: 'Updated Name' });
      service.update.mockResolvedValue(truck);

      const result = await controller.update('ABC123', { name: 'Updated Name' });

      expect(result).toBe(truck);
    });

    it('returns 404 when truck not found', async () => {
      service.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('MISSING', { name: 'Updated Name' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('PATCH /trucks/:code/status', () => {
    it('updates and returns the truck with new status', async () => {
      const truck = makeTruck({ status: 'Loading' });
      service.updateStatus.mockResolvedValue(truck);

      const result = await controller.updateStatus('ABC123', { status: 'Loading' });

      expect(result).toBe(truck);
    });

    it('returns 400 on invalid status transition', async () => {
      service.updateStatus.mockRejectedValue(new BadRequestException());

      await expect(controller.updateStatus('ABC123', { status: 'At Job' })).rejects.toThrow(BadRequestException);
    });

    it('returns 404 when truck not found', async () => {
      service.updateStatus.mockRejectedValue(new NotFoundException());

      await expect(controller.updateStatus('MISSING', { status: 'Loading' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /trucks/:code', () => {
    it('removes the truck', async () => {
      service.remove.mockResolvedValue(undefined);

      await expect(controller.remove('ABC123')).resolves.not.toThrow();
    });

    it('returns 404 when truck not found', async () => {
      service.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('MISSING')).rejects.toThrow(NotFoundException);
    });
  });
});
