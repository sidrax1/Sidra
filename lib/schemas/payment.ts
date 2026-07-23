import { z } from "zod";

import {
  currencyAmountSchema,
  documentIdSchema,
} from "@/lib/schemas/common";

export const verifyRazorpayPaymentSchema =

 z.object({
   orderId:
     documentIdSchema,
   providerOrderId: z
     .string()
     .trim()
     .min(5)
     .max(200),
   providerPaymentId: z
     .string()
     .trim()
     .min(5)
     .max(200),
   providerSignature: z
     .string()
     .trim()
     .regex(
       /^[a-f0-9]{64}$/i,
       "Invalid payment signature."
     ),
 });

export const refundPaymentSchema =
  z.object({
    paymentId:
      documentIdSchema,
    amountPaise:
      currencyAmountSchema.optional(),
    reason: z
      .string()
      .trim()
      .min(10)
      .max(1000),
    idempotencyKey: z
      .string()
      .trim()
      .min(8)
      .max(200),
  });
