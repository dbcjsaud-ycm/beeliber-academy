import { z } from 'zod';

export const issueCreateSchema = z.object({
  reservationId: z.string().uuid(),
  issueCode: z.enum([
    'OPS-001',
    'OPS-002',
    'OPS-003',
    'OPS-004',
    'OPS-005',
    'OPS-006',
    'OPS-007',
    'OPS-008',
    'OPS-009',
    'OPS-010',
  ]),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
  title: z.string().min(1),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().optional(),
});
