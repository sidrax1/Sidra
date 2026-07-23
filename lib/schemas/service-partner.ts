import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const indianPhoneSchema = z
  .string()
  .trim()
  .regex(
    /^[6-9]\d{9}$/,
    "Enter a valid Indian mobile number."
  );

const optionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) =>
    value && value.length > 0
      ? value
      : undefined
  );

const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2)
    .max(120),
  phoneNumber: indianPhoneSchema,
  addressLine1: z
    .string()
    .trim()
    .min(5)
    .max(200),
  addressLine2: optionalTextSchema,
  landmark: optionalTextSchema,
  city: z
    .string()
    .trim()
    .min(2)
    .max(100),
  district: optionalTextSchema,
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

const contactSchema = z.object({
  contactName: z
    .string()
    .trim()
    .min(2)
    .max(120),
  designation: optionalTextSchema,
  email: z
    .string()
    .trim()
    .email()
    .max(254),
  phoneNumber: indianPhoneSchema,
  alternatePhoneNumber: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Enter a valid alternate mobile number."
    )
    .optional(),
  websiteURL: z
    .string()
    .trim()
    .url()
    .optional(),
});

const servicePartnerTypeSchema = z.enum([
  "repairStudio",
  "inspectionCentre",
  "logisticsPartner",
  "installationPartner",
  "restorationSpecialist",
  "qualityAssuranceCentre",
  "multiServicePartner",
]);

const capabilitySchema = z.enum([
  "productInspection",
  "resinRepair",
  "surfaceRestoration",
  "structuralRepair",
  "hardwareReplacement",
  "electricalRepair",
  "customisationCorrection",
  "pickup",
  "reverseLogistics",
  "replacementDelivery",
  "onSiteService",
  "remoteAssessment",
  "qualityCertification",
  "securePackaging",
]);

export const createServicePartnerApplicationSchema =
  z.object({
    legalName: z
      .string()
      .trim()
      .min(2)
      .max(180),
    displayName: z
      .string()
      .trim()
      .min(2)
      .max(120),
    partnerType:
      servicePartnerTypeSchema,
    description: z
      .string()
      .trim()
      .min(
        50,
        "Provide at least 50 characters describing your service business."
      )
      .max(5000),
    contact: contactSchema,
    registeredAddress:
      addressSchema,
    capabilities: z
      .array(capabilitySchema)
      .min(
        1,
        "Select at least one service capability."
      )
      .max(14),
    coverageStates: z
      .array(
        z
          .string()
          .trim()
          .min(2)
          .max(100)
      )
      .min(
        1,
        "Select at least one service state."
      )
      .max(36),
    documentPaths: z
      .array(
        z.string().trim().min(1)
      )
      .min(
        1,
        "Upload at least one verification document."
      )
      .max(25),
  })
  .superRefine(
    (value, context) => {
      if (
        new Set(
          value.capabilities
        ).size !==
        value.capabilities.length
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: ["capabilities"],
          message:
            "Duplicate service capabilities are not allowed.",
        });
      }

      const normalizedStates =
        value.coverageStates.map(
          (state) =>
            state.toLowerCase()
        );

      if (
        new Set(normalizedStates)
          .size !==
        normalizedStates.length
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "coverageStates",
          ],
          message:
            "Duplicate coverage states are not allowed.",
        });
      }
    }
  );

export const reviewServicePartnerApplicationSchema =
  z.object({
    applicationId:
      identifierSchema,
    decision: z.enum([
      "approve",
      "requestInformation",
      "reject",
    ]),
    reviewerNote: z
      .string()
      .trim()
      .min(20)
      .max(3000),
    riskScore: z
      .number()
      .int()
      .min(0)
      .max(100),
  });

export const updateServicePartnerStatusSchema =
  z.object({
    partnerId: identifierSchema,
    status: z.enum([
      "pendingVerification",
      "active",
      "temporarilyUnavailable",
      "suspended",
      "rejected",
      "archived",
    ]),
    reason: z
      .string()
      .trim()
      .min(10)
      .max(2500),
  });

export const updateServicePartnerAvailabilitySchema =
  z.object({
    partnerId: identifierSchema,
    acceptingAssignments:
      z.boolean(),
    maximumConcurrentAssignments:
      z
        .number()
        .int()
        .min(1)
        .max(500),
    reason: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  });

export const assignServicePartnerSchema =
  z.object({
    partnerId: identifierSchema,
    sourceType: z.enum([
      "warrantyClaim",
      "returnInspection",
      "disputeInspection",
      "repairRequest",
      "qualityAudit",
    ]),
    sourceId: identifierSchema,
    customerId:
      identifierSchema,
    studioId: identifierSchema,
    capability:
      capabilitySchema,
    priority: z.enum([
      "low",
      "normal",
      "high",
      "urgent",
    ]),
    title: z
      .string()
      .trim()
      .min(5)
      .max(180),
    description: z
      .string()
      .trim()
      .min(20)
      .max(4000),
    responseDueAt: z
      .string()
      .datetime(),
    completionDueAt: z
      .string()
      .datetime()
      .optional(),
    estimatedCostPaise: z
      .number()
      .int()
      .nonnegative(),
    approvedCostPaise: z
      .number()
      .int()
      .nonnegative(),
    customerPayablePaise: z
      .number()
      .int()
      .nonnegative(),
    platformPayablePaise: z
      .number()
      .int()
      .nonnegative(),
  })
  .superRefine(
    (value, context) => {
      const responseDue =
        new Date(
          value.responseDueAt
        ).getTime();

      if (
        responseDue <= Date.now()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "responseDueAt",
          ],
          message:
            "Response deadline must be in the future.",
        });
      }

      if (
        value.completionDueAt &&
        new Date(
          value.completionDueAt
        ).getTime() <=
          responseDue
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "completionDueAt",
          ],
          message:
            "Completion deadline must be after the response deadline.",
        });
      }

      if (
        value.platformPayablePaise >
        value.approvedCostPaise
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "platformPayablePaise",
          ],
          message:
            "Partner payable value cannot exceed the approved service cost.",
        });
      }
    }
  );

export const updateServiceAssignmentStatusSchema =
  z.object({
    assignmentId:
      identifierSchema,
    status: z.enum([
      "accepted",
      "declined",
      "scheduled",
      "inProgress",
      "completed",
      "cancelled",
    ]),
    note: z
      .string()
      .trim()
      .min(5)
      .max(2500),
    scheduledAt: z
      .string()
      .datetime()
      .optional(),
    completionNote: z
      .string()
      .trim()
      .max(3000)
      .optional(),
  })
  .superRefine(
    (value, context) => {
      if (
        value.status ===
          "scheduled" &&
        !value.scheduledAt
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: ["scheduledAt"],
          message:
            "Scheduled time is required.",
        });
      }

      if (
        value.status ===
          "completed" &&
        (!value.completionNote ||
          value.completionNote
            .trim().length < 10)
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode.custom,
          path: [
            "completionNote",
          ],
          message:
            "A detailed completion note is required.",
        });
      }
    }
  );

export type CreateServicePartnerApplicationInput =
  z.infer<
    typeof createServicePartnerApplicationSchema
  >;

export type ReviewServicePartnerApplicationInput =
  z.infer<
    typeof reviewServicePartnerApplicationSchema
  >;

export type UpdateServicePartnerStatusInput =
  z.infer<
    typeof updateServicePartnerStatusSchema
  >;

export type UpdateServicePartnerAvailabilityInput =
  z.infer<
    typeof updateServicePartnerAvailabilitySchema
  >;

export type AssignServicePartnerInput =
  z.infer<
    typeof assignServicePartnerSchema
  >;

export type UpdateServiceAssignmentStatusInput =
  z.infer<
    typeof updateServiceAssignmentStatusSchema
  >;
