import { z } from 'zod';

export const paymentConfirmSchema = z.object({
  reservationId: z.string().uuid(),
  paymentKey: z.string().min(3),
  amount: z.number().positive(),
  provider: z.string().min(2).default('tosspayments'),
});
