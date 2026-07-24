import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const evidencePathSchema = z
  .string()
  .trim()
  .min(1, "Evidence path cannot be empty.");

const returnAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(120),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid Indian mobile number."
    ),
  addressLine1: z
    .string()
    .trim()
    .min(5)
    .max(200),
  addressLine2: z
    .string()
    .trim()
    .max(200)
    .optional(),
  landmark: z
    .string()
    .trim()
    .max(150)
    .optional(),
  city: z
    .string()
    .trim()
    .min(2)
    .max(100),
  state: z
    .string()
    .trim()
    .min(2)
    .max(100),
  postalCode: z
    .string()
    .trim()
    .regex(
      /^[1-9][0-9]{5}$/,
      "Enter a valid six-digit postal code."
    ),
  countryCode: z.literal("IN"),
});

export const createReturnRequestSchema = z.object({
  orderId: identifierSchema,
  orderItemId: identifierSchema,
  quantity: z
    .number()
    .int()
    .positive()
    .max(100),
  reason: z.enum([
    "damaged",
    "defective",
    "wrongItem",
    "notAsDescribed",
    "missingParts",
    "qualityConcern",
    "sizeOrDimensionIssue",
    "changedMind",
    "lateDelivery",
    "other",
  ]),
  resolutionRequested: z.enum([
    "refund",
    "replacement",
    "repair",
    "storeCredit",
  ]),
  description: z
    .string()
    .trim()
    .min(
      30,
      "Provide at least 30 characters describing the return."
    )
    .max(4000),
  evidencePaths: z
    .array(evidencePathSchema)
    .max(15)
    .default([]),
  pickupAddress: returnAddressSchema.optional(),
});

export const returnDecisionSchema = z.object({
  returnId: identifierSchema,
  approved: z.boolean(),
  resolution: z
    .enum([
      "refund",
      "replacement",
      "repair",
      "storeCredit",
    ])
    .optional(),
  reason: z
    .string()
    .trim()
    .min(20)
    .max(2500),
  customerMessage: z
    .string()
    .trim()
    .min(10)
    .max(2500),
}).superRefine((value, context) => {
  if (
    value.approved &&
    !value.resolution
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["resolution"],
      message:
        "Resolution is required when approving a return.",
    });
  }
});

export const scheduleReturnPickupSchema = z.object({
  returnId: identifierSchema,
  pickupAddress: returnAddressSchema,
  pickupScheduledAt: z
    .string()
    .datetime(),
  logisticsProvider: z
    .string()
    .trim()
    .min(2)
    .max(150),
}).superRefine((value, context) => {
  if (
    new Date(
      value.pickupScheduledAt
    ).getTime() <= Date.now()
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pickupScheduledAt"],
      message:
        "Pickup schedule must be in the future.",
    });
  }
});

export const updateReturnTrackingSchema = z.object({
  returnId: identifierSchema,
  trackingNumber: z
    .string()
    .trim()
    .min(3)
    .max(150),
  trackingURL: z
    .string()
    .url()
    .optional(),
  logisticsProvider: z
    .string()
    .trim()
    .min(2)
    .max(150),
});

export const returnInspectionSchema = z
  .object({
    returnId: identifierSchema,
    acceptedQuantity: z
      .number()
      .int()
      .nonnegative(),
    rejectedQuantity: z
      .number()
      .int()
      .nonnegative(),
    conditionScore: z
      .number()
      .int()
      .min(0)
      .max(100),
    findings: z
      .array(
        z.object({
          id: identifierSchema,
          label: z
            .string()
            .trim()
            .min(2)
            .max(200),
          passed: z.boolean(),
          note: z
            .string()
            .trim()
            .max(1000)
            .optional(),
        })
      )
      .min(1)
      .max(30),
    internalNote: z
      .string()
      .trim()
      .max(2500)
      .optional(),
    customerNote: z
      .string()
      .trim()
      .max(2500)
      .optional(),
    evidencePaths: z
      .array(evidencePathSchema)
      .max(15)
      .default([]),
    shippingRefundPaise: z
      .number()
      .int()
      .nonnegative(),
    taxRefundPaise: z
      .number()
      .int()
      .nonnegative(),
    restockingFeePaise: z
      .number()
      .int()
      .nonnegative(),
    deductionPaise: z
      .number()
      .int()
      .nonnegative(),
  })
  .superRefine((value, context) => {
    if (
      value.acceptedQuantity +
        value.rejectedQuantity <=
      0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["acceptedQuantity"],
        message:
          "At least one returned unit must be inspected.",
      });
    }
  });

export const cancelReturnSchema = z.object({
  returnId: identifierSchema,
  reason: z
    .string()
    .trim()
    .min(10)
    .max(1500),
});

export type CreateReturnRequestInput =
  z.infer<
    typeof createReturnRequestSchema
  >;

export type ReturnDecisionInput =
  z.infer<
    typeof returnDecisionSchema
  >;

export type ScheduleReturnPickupInput =
  z.infer<
    typeof scheduleReturnPickupSchema
  >;

export type UpdateReturnTrackingInput =
  z.infer<
    typeof updateReturnTrackingSchema
  >;

export type ReturnInspectionInput =
  z.infer<
    typeof returnInspectionSchema
  >;

export type CancelReturnInput =
  z.infer<
    typeof cancelReturnSchema
  >;

export interface ReturnEvidenceRequestInput {
  readonly returnRequestId: string;
  readonly message: string;
  readonly requiredEvidence: readonly string[];
}

export interface ReturnPickupInput {
  readonly returnRequestId: string;
  readonly carrier: string;
  readonly trackingNumber: string;
  readonly trackingURL?: string;
  readonly pickupDate: string;
}

export interface ReturnResolutionInput {
  readonly returnRequestId: string;
  readonly resolution: "replacement" | "refund" | "storeCredit";
  readonly approvedRefundPaise: number;
  readonly resolutionNote: string;
}
