import { z } from "zod";

export const refundRequestSchema = z.object({
  orderId: z.string().min(1),
  amountPaise: z.number().int().positive(),
  reason: z.string().min(10).max(1000),
});

export type RefundRequestInput = z.infer<typeof refundRequestSchema>;
