import { z } from "zod";

export const customOrderDecisionSchema = z.object({
  customOrderId: z.string().trim().min(1),
  decision: z.enum([
    "accept",
    "requestClarification",
    "reject",
  ]),
  message: z.string().trim().max(1500),
});

export const customOrderQuoteSchema = z
  .object({
    customOrderId: z.string().trim().min(1),
    amountPaise: z.number().int().positive(),
    shippingFeePaise: z.number().int().nonnegative(),
    taxPaise: z.number().int().nonnegative(),
    estimatedProductionDays: z
      .number()
      .int()
      .min(1)
      .max(365),
    validUntil: z.string().datetime(),
    notes: z.string().trim().max(3000).optional(),
    terms: z.string().trim().max(3000).optional(),
  })
  .superRefine((value, context) => {
    if (new Date(value.validUntil).getTime() <= Date.now()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["validUntil"],
        message: "Quote validity must be in the future.",
      });
    }
  });

export const customOrderQuoteRevisionSchema = z.object({
  customOrderId: z.string().trim().min(1),
  quoteId: z.string().trim().min(1),
  message: z.string().trim().min(10).max(2000),
});

export const customOrderProductionUpdateSchema = z.object({
  customOrderId: z.string().trim().min(1),
  stage: z.enum([
    "materialsPrepared",
    "designApproved",
    "casting",
    "curing",
    "finishing",
    "qualityCheck",
    "packaging",
    "completed",
  ]),
  message: z.string().trim().min(5).max(2000),
  attachmentPaths: z.array(z.string().trim().min(1)).max(10),
  customerVisible: z.boolean(),
});

export const customOrderDispatchSchema = z.object({
  customOrderId: z.string().trim().min(1),
  carrier: z.string().trim().min(2).max(100),
  trackingNumber: z.string().trim().min(3).max(150),
  trackingURL: z.string().url().optional(),
  dispatchedAt: z.string().datetime(),
  estimatedDeliveryDate: z.string().datetime().optional(),
  packageCount: z.number().int().min(1).max(100),
  weightGrams: z.number().int().positive(),
  lengthCentimetres: z.number().positive(),
  widthCentimetres: z.number().positive(),
  heightCentimetres: z.number().positive(),
  dispatchNote: z.string().trim().max(1500).optional(),
});

export const customOrderDeliveryConfirmationSchema = z.object({
  customOrderId: z.string().trim().min(1),
  received: z.literal(true),
  conditionConfirmed: z.literal(true),
  rating: z.number().int().min(1).max(5),
  customerNote: z.string().trim().max(1500).optional(),
});

export type CustomOrderDecisionInput = z.infer<
  typeof customOrderDecisionSchema
>;

export type CustomOrderQuoteInput = z.infer<
  typeof customOrderQuoteSchema
>;

export type CustomOrderQuoteRevisionInput = z.infer<
  typeof customOrderQuoteRevisionSchema
>;

export type CustomOrderProductionUpdateInput = z.infer<
  typeof customOrderProductionUpdateSchema
>;

export type CustomOrderDispatchInput = z.infer<
  typeof customOrderDispatchSchema
>;

export type CustomOrderDeliveryConfirmationInput = z.infer<
  typeof customOrderDeliveryConfirmationSchema
>;
