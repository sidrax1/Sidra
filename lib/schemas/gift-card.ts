import { z } from "zod";

const identifierSchema = z.string().trim().min(1);

export const purchaseGiftCardSchema = z
  .object({
    valuePaise: z
      .number()
      .int()
      .min(50000)
      .max(5000000),
    recipientName: z.string().trim().min(2).max(100),
    recipientEmail: z.string().trim().email().max(254),
    message: z.string().trim().max(500).optional(),
    designId: identifierSchema,
    deliveryMode: z.enum(["immediate", "scheduled"]),
    scheduledDeliveryAt: z.string().datetime().optional(),
  })
  .superRefine((value, context) => {
    if (
      value.deliveryMode === "scheduled" &&
      !value.scheduledDeliveryAt
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDeliveryAt"],
        message: "Scheduled delivery time is required.",
      });
    }

    if (
      value.scheduledDeliveryAt &&
      new Date(value.scheduledDeliveryAt).getTime() <=
        Date.now()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledDeliveryAt"],
        message: "Delivery time must be in the future.",
      });
    }
  });

export const redeemGiftCardSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{8,40}$/),
  customerId: identifierSchema,
  orderId: identifierSchema,
  requestedAmountPaise: z.number().int().positive(),
});

export const validateGiftCardSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{8,40}$/),
  customerId: identifierSchema,
});

export const adjustGiftCardBalanceSchema = z.object({
  giftCardId: identifierSchema,
  amountPaise: z
    .number()
    .int()
    .refine(
      (value) => value !== 0,
      "Adjustment cannot be zero."
    ),
  reason: z.string().trim().min(10).max(1000),
});

export type PurchaseGiftCardInput = z.infer<
  typeof purchaseGiftCardSchema
>;

export type RedeemGiftCardInput = z.infer<
  typeof redeemGiftCardSchema
>;

export type ValidateGiftCardInput = z.infer<
  typeof validateGiftCardSchema
>;

export type AdjustGiftCardBalanceInput = z.infer<
  typeof adjustGiftCardBalanceSchema
>;
