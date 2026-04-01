import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const alphanumeric = /^[a-zA-Z0-9]+$/;

export const TruckStatusEnum = z.enum([
  'Out Of Service',
  'Loading',
  'To Job',
  'At Job',
  'Returning',
]);
export type TruckStatus = z.infer<typeof TruckStatusEnum>;

const CreateTruckSchema = z.object({
  code: z.string().min(1).regex(alphanumeric, 'code must be alphanumeric'),
  name: z.string().min(1),
  description: z.string().optional(),
});

const UpdateTruckSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const TruckQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['code', 'name']).optional().default('code'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

const UpdateTruckStatusSchema = z.object({
  status: TruckStatusEnum,
});

export class CreateTruckDto extends createZodDto(CreateTruckSchema) {}
export class UpdateTruckDto extends createZodDto(UpdateTruckSchema) {}
export class TruckQueryDto extends createZodDto(TruckQuerySchema) {}
export class UpdateTruckStatusDto extends createZodDto(UpdateTruckStatusSchema) {}
