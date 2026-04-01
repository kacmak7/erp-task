import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { TruckService } from './truck.service';
import { Truck } from './truck.entity';
import type { TruckStatus } from './truck.schema';

const makeTruck = (overrides: Partial<Truck> = {}): Truck => ({
  code: 'ABC123',
  name: 'Test Truck',
  status: 'Out Of Service',
  description: null,
  ...overrides,
});

describe('TruckService', () => {
  let service: TruckService;
  let repo: {
    find: jest.Mock;
    findOneBy: jest.Mock;
    existsBy: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
    remove: jest.Mock;
  };

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      existsBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TruckService,
        { provide: getRepositoryToken(Truck), useValue: repo },
      ],
    }).compile();

    service = module.get(TruckService);
  });

  describe('GET /trucks', () => {
    it('returns all trucks', async () => {
      const trucks = [makeTruck()];
      repo.find.mockResolvedValue(trucks);

      const result = await service.findAll({ search: undefined, sortBy: 'code', sortOrder: 'asc' });

      expect(result).toBe(trucks);
    });

    it('filters by search term', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll({ search: 'foo', sortBy: 'name', sortOrder: 'desc' });

      const { where, order } = repo.find.mock.calls[0][0];
      expect(where).toHaveLength(2); // code + name ILike
      expect(order).toEqual({ name: 'DESC' });
    });
  });

  describe('GET /trucks/:code', () => {
    it('returns the truck', async () => {
      const truck = makeTruck();
      repo.findOneBy.mockResolvedValue(truck);

      await expect(service.findOne('ABC123')).resolves.toBe(truck);
    });

    it('throws 404 when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('MISSING')).rejects.toThrow(NotFoundException);
    });
  });

  describe('POST /trucks', () => {
    it('creates and returns the truck', async () => {
      const truck = makeTruck();
      repo.existsBy.mockResolvedValue(false);
      repo.create.mockReturnValue(truck);
      repo.save.mockResolvedValue(truck);

      await expect(service.create({ code: 'ABC123', name: 'Test Truck' })).resolves.toBe(truck);
    });

    it('throws 409 when code already exists', async () => {
      repo.existsBy.mockResolvedValue(true);

      await expect(service.create({ code: 'ABC123', name: 'Test Truck' })).rejects.toThrow(ConflictException);
    });
  });

  describe('PATCH /trucks/:code', () => {
    it('saves and returns the updated truck', async () => {
      const truck = makeTruck();
      const updated = makeTruck({ name: 'New Name' });
      repo.findOneBy.mockResolvedValue(truck);
      repo.save.mockResolvedValue(updated);

      await expect(service.update('ABC123', { name: 'New Name' })).resolves.toBe(updated);
    });

    it('throws 404 when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update('MISSING', { name: 'New Name' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /trucks/:code', () => {
    it('removes the truck', async () => {
      const truck = makeTruck();
      repo.findOneBy.mockResolvedValue(truck);
      repo.remove.mockResolvedValue(truck);

      await service.remove('ABC123');

      expect(repo.remove).toHaveBeenCalledWith(truck);
    });

    it('throws 404 when not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('MISSING')).rejects.toThrow(NotFoundException);
    });
  });

  describe('PATCH /trucks/:code/status', () => {
    it('throws 404 when truck not found', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.updateStatus('MISSING', { status: 'Loading' })).rejects.toThrow(NotFoundException);
    });

    const validTransitions: [TruckStatus, TruckStatus][] = [
      ['Out Of Service', 'Loading'],
      ['Out Of Service', 'To Job'],
      ['Out Of Service', 'At Job'],
      ['Out Of Service', 'Returning'],
      ['Out Of Service', 'Out Of Service'],
      ['Loading', 'To Job'],
      ['Loading', 'Out Of Service'],
      ['To Job', 'At Job'],
      ['To Job', 'Out Of Service'],
      ['At Job', 'Returning'],
      ['At Job', 'Out Of Service'],
      ['Returning', 'Loading'],
      ['Returning', 'Out Of Service'],
    ];

    test.each(validTransitions)('allows %s → %s', async (from, to) => {
      repo.findOneBy.mockResolvedValue(makeTruck({ status: from }));
      repo.save.mockResolvedValue(makeTruck({ status: to }));

      await expect(service.updateStatus('ABC123', { status: to })).resolves.toBeDefined();
    });

    const invalidTransitions: [TruckStatus, TruckStatus][] = [
      ['Loading', 'At Job'],
      ['Loading', 'Returning'],
      ['To Job', 'Loading'],
      ['To Job', 'Returning'],
      ['At Job', 'Loading'],
      ['At Job', 'To Job'],
      ['Returning', 'To Job'],
      ['Returning', 'At Job'],
    ];

    test.each(invalidTransitions)('rejects %s → %s', async (from, to) => {
      repo.findOneBy.mockResolvedValue(makeTruck({ status: from }));

      await expect(service.updateStatus('ABC123', { status: to })).rejects.toThrow(BadRequestException);
    });
  });
});
