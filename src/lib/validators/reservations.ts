import { z } from 'zod';

export const reservationItemSchema = z.object({
  itemTypeCode: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'SPECIAL']),
  quantity: z.number().int().positive(),
});

export const reservationValidateSchema = z.object({
  branchId: z.string().uuid(),
  serviceCode: z.enum(['STANDARD', 'EXPRESS']),
  scheduledAt: z.string().datetime(),
  items: z.array(reservationItemSchema).min(1),
  languageCode: z.string().min(2).max(10).default('en'),
});

export const reservationCreateSchema = reservationValidateSchema.extend({
  customerId: z.string().uuid(),
  customerName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  notes: z.string().max(1000).optional(),
});
