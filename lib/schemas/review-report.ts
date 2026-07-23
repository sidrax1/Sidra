import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const evidencePathSchema = z
  .string()
  .trim()
  .min(1, "Evidence path cannot be empty.");

export const createReviewReportSchema = z.object({
  reviewId: identifierSchema,
  reason: z.enum([
    "spam",
    "harassment",
    "hateSpeech",
    "personalInformation",
    "falseInformation",
    "irrelevantContent",
    "commercialPromotion",
    "conflictOfInterest",
    "prohibitedContent",
    "other",
  ]),
  description: z
    .string()
    .trim()
    .min(
      20,
      "Provide at least 20 characters explaining the report."
    )
    .max(2500),
  evidencePaths: z
    .array(evidencePathSchema)
    .max(10)
    .default([]),
});

export const assignReviewReportSchema = z.object({
  reportId: identifierSchema,
  assigneeId: identifierSchema,
  note: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((value) =>
      value && value.length > 0 ? value : undefined
    ),
});

export const updateReviewReportStatusSchema = z.object({
  reportId: identifierSchema,
  status: z.enum([
    "submitted",
    "underReview",
    "actionRequired",
    "resolved",
    "dismissed",
    "escalated",
  ]),
  reason: z
    .string()
    .trim()
    .min(10)
    .max(1500),
});

export const resolveReviewReportSchema = z.object({
  reportId: identifierSchema,
  resolution: z.enum([
    "reviewPublished",
    "reviewHidden",
    "reviewRejected",
    "reviewDeleted",
    "reportDismissed",
    "accountRestricted",
    "escalatedToCompliance",
  ]),
  reason: z
    .string()
    .trim()
    .min(
      20,
      "Provide a complete resolution reason."
    )
    .max(2500),
  internalNote: z
    .string()
    .trim()
    .max(2500)
    .optional()
    .transform((value) =>
      value && value.length > 0 ? value : undefined
    ),
  notifyReporter: z.boolean(),
  notifyReviewAuthor: z.boolean(),
  notifyStudio: z.boolean(),
});

export const mergeReviewReportsSchema = z
  .object({
    primaryReportId: identifierSchema,
    duplicateReportIds: z
      .array(identifierSchema)
      .min(1)
      .max(100),
    reason: z
      .string()
      .trim()
      .min(10)
      .max(1500),
  })
  .superRefine((value, context) => {
    if (
      value.duplicateReportIds.includes(
        value.primaryReportId
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duplicateReportIds"],
        message:
          "Primary report cannot also be marked as a duplicate.",
      });
    }

    if (
      new Set(value.duplicateReportIds).size !==
      value.duplicateReportIds.length
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duplicateReportIds"],
        message:
          "Duplicate report list contains repeated identifiers.",
      });
    }
  });

export type CreateReviewReportInput = z.infer<
  typeof createReviewReportSchema
>;

export type AssignReviewReportInput = z.infer<
  typeof assignReviewReportSchema
>;

export type UpdateReviewReportStatusInput = z.infer<
  typeof updateReviewReportStatusSchema
>;

export type ResolveReviewReportInput = z.infer<
  typeof resolveReviewReportSchema
>;

export type MergeReviewReportsInput = z.infer<
  typeof mergeReviewReportsSchema
>;
