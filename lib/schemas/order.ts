import { z } from "zod";

const nonEmptyIdentifier = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const optionalMessage = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((value) =>
    value && value.length > 0 ? value : undefined
  );

export const orderCancellationSchema = z.object({
  orderId: nonEmptyIdentifier,
  reason: z.enum([
    "orderedByMistake",
    "duplicateOrder",
    "addressIssue",
    "deliveryDelay",
    "productUnavailable",
    "sellerUnableToFulfil",
    "paymentIssue",
    "policyViolation",
    "other",
  ]),
  explanation: z
    .string()
    .trim()
    .min(10, "Provide at least 10 characters.")
    .max(1500),
});

export const orderShipmentSchema = z
  .object({
    orderId: nonEmptyIdentifier,
    carrier: z.string().trim().min(2).max(100),
    trackingNumber: z.string().trim().min(3).max(150),
    trackingURL: z.string().trim().url().optional(),
    packageCount: z.number().int().min(1).max(100),
    dispatchedAt: z.string().datetime(),
    estimatedDeliveryDate: z.string().datetime().optional(),
    weightGrams: z.number().int().positive().max(1_000_000),
    lengthCentimetres: z.number().positive().max(500),
    widthCentimetres: z.number().positive().max(500),
    heightCentimetres: z.number().positive().max(500),
    note: optionalMessage,
  })
  .superRefine((value, context) => {
    if (
      value.estimatedDeliveryDate &&
      new Date(value.estimatedDeliveryDate).getTime() <
        new Date(value.dispatchedAt).getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["estimatedDeliveryDate"],
        message:
          "Estimated delivery must be after the dispatch time.",
      });
    }
  });

export const orderStatusUpdateSchema = z.object({
  orderId: nonEmptyIdentifier,
  status: z.enum([
    "confirmed",
    "processing",
    "readyToShip",
    "shipped",
    "outForDelivery",
    "delivered",
  ]),
  message: z.string().trim().min(5).max(1500),
  customerVisible: z.boolean(),
});

export const orderDeliveryConfirmationSchema = z.object({
  orderId: nonEmptyIdentifier,
  received: z.literal(true),
  conditionConfirmed: z.literal(true),
  deliveryNote: optionalMessage,
});

export const returnRequestSchema = z.object({
  orderId: nonEmptyIdentifier,
  orderItemIds: z.array(nonEmptyIdentifier).min(1).max(25),
  reason: z.enum([
    "damaged",
    "wrongItem",
    "notAsDescribed",
    "missingParts",
    "qualityConcern",
    "deliveryDamage",
    "other",
  ]),
  explanation: z
    .string()
    .trim()
    .min(20, "Provide at least 20 characters.")
    .max(2500),
  evidencePaths: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),
  preferredResolution: z.enum([
    "replacement",
    "refund",
    "storeCredit",
  ]),
});

export const returnDecisionSchema = z.object({
  returnRequestId: nonEmptyIdentifier,
  decision: z.enum(["approve", "reject", "requestEvidence"]),
  reason: z.string().trim().min(10).max(2000),
  approvedRefundPaise: z.number().int().nonnegative().optional(),
});

export const orderNoteSchema = z.object({
  orderId: nonEmptyIdentifier,
  message: z.string().trim().min(2).max(2000),
  customerVisible: z.boolean(),
});

export type OrderCancellationInput = z.infer<
  typeof orderCancellationSchema
>;

export type OrderShipmentInput = z.infer<
  typeof orderShipmentSchema
>;

export type OrderStatusUpdateInput = z.infer<
  typeof orderStatusUpdateSchema
>;

export type OrderDeliveryConfirmationInput = z.infer<
  typeof orderDeliveryConfirmationSchema
>;

export type ReturnRequestInput = z.infer<
  typeof returnRequestSchema
>;

export type ReturnDecisionInput = z.infer<
  typeof returnDecisionSchema
>;

export type OrderNoteInput = z.infer<typeof orderNoteSchema>;
