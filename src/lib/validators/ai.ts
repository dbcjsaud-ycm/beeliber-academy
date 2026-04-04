import { z } from 'zod';

export const aiReviewSchema = z.object({
  useCase: z.enum(['cs', 'ad_copy', 'translation', 'notice', 'b2b_proposal']),
  generatedText: z.string().min(1),
  sourceRef: z.string().optional(),
  inputContext: z.record(z.string(), z.any()).default({}),
});
