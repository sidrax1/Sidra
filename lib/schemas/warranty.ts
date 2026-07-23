import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const evidencePathSchema = z
  .string()
  .trim()
  .min(1, "Evidence path cannot be empty.");

const serviceAddressSchema = z.object({
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

export const registerWarrantySchema = z.object({
  warrantyId: identifierSchema,
  serialNumber: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .optional(),
  registrationReference: z
    .string()
    .trim()
    .max(200)
    .optional(),
});

export const createWarrantyClaimSchema = z.object({
  warrantyId: identifierSchema,
  issueTitle: z
    .string()
    .trim()
    .min(5)
    .max(180),
  issueDescription: z
    .string()
    .trim()
    .min(
      30,
      "Provide at least 30 characters describing the issue."
    )
    .max(5000),
  failureDate: z
    .string()
    .datetime(),
  requestedResolution: z.enum([
    "repair",
    "replacement",
    "partialRefund",
    "fullRefund",
    "storeCredit",
  ]),
  coverageType: z
    .enum([
      "manufacturingDefect",
      "structuralFailure",
      "finishDefect",
      "hardwareFailure",
      "electricalFailure",
      "accidentalDamage",
      "extendedCare",
      "customCoverage",
    ])
    .optional(),
  evidencePaths: z
    .array(evidencePathSchema)
    .max(20)
    .default([]),
}).superRefine((value, context) => {
  const failureTimestamp = new Date(
    value.failureDate
  ).getTime();

  if (
    Number.isNaN(failureTimestamp)
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["failureDate"],
      message:
        "Failure date is invalid.",
    });

    return;
  }

  if (
    failureTimestamp > Date.now()
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["failureDate"],
      message:
        "Failure date cannot be in the future.",
    });
  }
});

export const warrantyClaimAssessmentSchema = z
  .object({
    claimId: identifierSchema,
    coverageItemId:
      identifierSchema.optional(),
    covered: z.boolean(),
    reason: z
      .string()
      .trim()
      .min(20)
      .max(3000),
    estimatedServiceCostPaise: z
      .number()
      .int()
      .nonnegative(),
    approvedCoveragePaise: z
      .number()
      .int()
      .nonnegative(),
    deductiblePaise: z
      .number()
      .int()
      .nonnegative(),
    customerPayablePaise: z
      .number()
      .int()
      .nonnegative(),
  })
  .superRefine((value, context) => {
    if (
      !value.covered &&
      value.approvedCoveragePaise >
        0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "approvedCoveragePaise",
        ],
        message:
          "Uncovered claims cannot have an approved coverage amount.",
      });
    }

    if (
      value.approvedCoveragePaise +
        value.customerPayablePaise <
      value.estimatedServiceCostPaise
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [
          "customerPayablePaise",
        ],
        message:
          "Coverage and customer payable values must account for the estimated service cost.",
      });
    }
  });

export const warrantyClaimDecisionSchema = z.object({
  claimId: identifierSchema,
  approved: z.boolean(),
  resolution: z.enum([
    "repair",
    "replacement",
    "partialRefund",
    "fullRefund",
    "storeCredit",
    "claimRejected",
  ]),
  reason: z
    .string()
    .trim()
    .min(20)
    .max(4000),
  customerMessage: z
    .string()
    .trim()
    .min(10)
    .max(3000),
  internalNote: z
    .string()
    .trim()
    .max(3000)
    .optional(),
}).superRefine((value, context) => {
  if (
    value.approved &&
    value.resolution ===
      "claimRejected"
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["resolution"],
      message:
        "Approved claims cannot use the rejected resolution.",
    });
  }

  if (
    !value.approved &&
    value.resolution !==
      "claimRejected"
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["resolution"],
      message:
        "Rejected claims must use the claim rejected resolution.",
    });
  }
});

export const warrantyServiceAppointmentSchema =
  z
    .object({
      claimId: identifierSchema,
      serviceMode: z.enum([
        "pickup",
        "dropOff",
        "onSite",
        "remoteAssessment",
      ]),
      scheduledAt: z
        .string()
        .datetime(),
      address:
        serviceAddressSchema.optional(),
      servicePartnerId:
        identifierSchema.optional(),
      servicePartnerName: z
        .string()
        .trim()
        .max(180)
        .optional(),
      logisticsProvider: z
        .string()
        .trim()
        .max(180)
        .optional(),
    })
    .superRefine(
      (value, context) => {
        if (
          new Date(
            value.scheduledAt
          ).getTime() <= Date.now()
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["scheduledAt"],
            message:
              "Service appointment must be scheduled in the future.",
          });
        }

        if (
          (value.serviceMode ===
            "pickup" ||
            value.serviceMode ===
              "onSite") &&
          !value.address
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: ["address"],
            message:
              "A service address is required for pickup and on-site appointments.",
          });
        }

        if (
          value.serviceMode ===
            "pickup" &&
          !value.logisticsProvider
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,
            path: [
              "logisticsProvider",
            ],
            message:
              "A logistics provider is required for pickup service.",
          });
        }
      }
    );

export const updateWarrantyTrackingSchema =
  z.object({
    claimId: identifierSchema,
    logisticsProvider: z
      .string()
      .trim()
      .min(2)
      .max(180),
    trackingNumber: z
      .string()
      .trim()
      .min(3)
      .max(180),
    trackingURL: z
      .string()
      .url()
      .optional(),
  });

export const transferWarrantySchema = z.object({
  warrantyId: identifierSchema,
  newOwnerEmail: z
    .string()
    .trim()
    .email(),
  transferReason: z
    .string()
    .trim()
    .min(10)
    .max(1500),
});

export const voidWarrantySchema = z.object({
  warrantyId: identifierSchema,
  reason: z
    .string()
    .trim()
    .min(20)
    .max(2500),
});

export const cancelWarrantyClaimSchema = z.object({
  claimId: identifierSchema,
  reason: z
    .string()
    .trim()
    .min(10)
    .max(1500),
});

export type RegisterWarrantyInput =
  z.infer<
    typeof registerWarrantySchema
  >;

export type CreateWarrantyClaimInput =
  z.infer<
    typeof createWarrantyClaimSchema
  >;

export type WarrantyClaimAssessmentInput =
  z.infer<
    typeof warrantyClaimAssessmentSchema
  >;

export type WarrantyClaimDecisionInput =
  z.infer<
    typeof warrantyClaimDecisionSchema
  >;

export type WarrantyServiceAppointmentInput =
  z.infer<
    typeof warrantyServiceAppointmentSchema
  >;

export type UpdateWarrantyTrackingInput =
  z.infer<
    typeof updateWarrantyTrackingSchema
  >;

export type TransferWarrantyInput =
  z.infer<
    typeof transferWarrantySchema
  >;

export type VoidWarrantyInput =
  z.infer<
    typeof voidWarrantySchema
  >;

export type CancelWarrantyClaimInput =
  z.infer<
    typeof cancelWarrantyClaimSchema
  >;
