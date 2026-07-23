import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) =>
    value && value.length > 0 ? value : undefined
  );

export const createDisputeSchema = z.object({
  orderId: identifierSchema,
  reason: z.enum([
    "orderNotReceived",
    "itemDamaged",
    "itemNotAsDescribed",
    "wrongItem",
    "unauthorizedPayment",
    "duplicatePayment",
    "refundNotReceived",
    "sellerNonResponsive",
    "serviceNotDelivered",
    "other",
  ]),
  title: z
    .string()
    .trim()
    .min(5)
    .max(150),
  description: z
    .string()
    .trim()
    .min(
      30,
      "Provide at least 30 characters describing the dispute."
    )
    .max(4000),
  requestedResolution: z.enum([
    "fullRefund",
    "partialRefund",
    "replacement",
    "storeCredit",
    "releasePayment",
    "denyClaim",
    "mutualSettlement",
  ]),
  disputedAmountPaise: z
    .number()
    .int()
    .positive(),
  evidencePaths: z
    .array(
      z.string().trim().min(1)
    )
    .max(15)
    .default([]),
});

export const disputeEvidenceSchema = z.object({
  disputeId: identifierSchema,
  evidencePaths: z
    .array(
      z.string().trim().min(1)
    )
    .min(1)
    .max(15),
  description: z
    .string()
    .trim()
    .max(1500)
    .optional(),
});

export const disputeAssignmentSchema = z.object({
  disputeId: identifierSchema,
  assigneeId: identifierSchema,
  team: z.enum([
    "support",
    "payments",
    "compliance",
    "legal",
  ]),
  note: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const disputeStatusUpdateSchema = z.object({
  disputeId: identifierSchema,
  status: z.enum([
    "submitted",
    "underReview",
    "evidenceRequired",
    "merchantResponseRequired",
    "escalated",
    "resolvedForCustomer",
    "resolvedForStudio",
    "partiallyResolved",
    "withdrawn",
    "closed",
  ]),
  reason: z
    .string()
    .trim()
    .min(10)
    .max(2000),
  customerVisible: z.boolean(),
  studioVisible: z.boolean(),
});

export const disputeDecisionSchema = z
  .object({
    disputeId: identifierSchema,
    resolution: z.enum([
      "fullRefund",
      "partialRefund",
      "replacement",
      "storeCredit",
      "releasePayment",
      "denyClaim",
      "mutualSettlement",
    ]),
    approvedRefundPaise: z
      .number()
      .int()
      .nonnegative(),
    releasedSettlementPaise: z
      .number()
      .int()
      .nonnegative(),
    reason: z
      .string()
      .trim()
      .min(30)
      .max(4000),
    customerMessage: z
      .string()
      .trim()
      .min(10)
      .max(2500),
    studioMessage: z
      .string()
      .trim()
      .min(10)
      .max(2500),
    internalNote: optionalTextSchema,
    appealAllowed: z.boolean(),
    appealDeadline: z
      .string()
      .datetime()
      .optional(),
  })
  .superRefine((value, context) => {
    if (
      value.appealAllowed &&
      !value.appealDeadline
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["appealDeadline"],
        message:
          "Appeal deadline is required when appeals are allowed.",
      });
    }

    if (
      value.appealDeadline &&
      new Date(
        value.appealDeadline
      ).getTime() <= Date.now()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["appealDeadline"],
        message:
          "Appeal deadline must be in the future.",
      });
    }
  });

export const disputeMessageSchema = z.object({
  disputeId: identifierSchema,
  message: z
    .string()
    .trim()
    .min(2)
    .max(3000),
  attachmentPaths: z
    .array(
      z.string().trim().min(1)
    )
    .max(10)
    .default([]),
  internal: z.boolean(),
});

export const disputeWithdrawalSchema = z.object({
  disputeId: identifierSchema,
  reason: z
    .string()
    .trim()
    .min(10)
    .max(1500),
});

export type CreateDisputeInput = z.infer<
  typeof createDisputeSchema
>;

export type CreateDisputeFormValues = z.input<
  typeof createDisputeSchema
>;

export type DisputeEvidenceInput = z.infer<
  typeof disputeEvidenceSchema
>;

export type DisputeAssignmentInput = z.infer<
  typeof disputeAssignmentSchema
>;

export type DisputeStatusUpdateInput = z.infer<
  typeof disputeStatusUpdateSchema
>;

export type DisputeDecisionInput = z.infer<
  typeof disputeDecisionSchema
>;

export type DisputeMessageInput = z.infer<
  typeof disputeMessageSchema
>;

export type DisputeWithdrawalInput = z.infer<
  typeof disputeWithdrawalSchema
>;
