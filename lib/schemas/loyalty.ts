import { z } from "zod";

const identifierSchema = z
  .string()
  .trim()
  .min(1, "A valid identifier is required.");

const optionalIdentifierListSchema = z
  .array(identifierSchema)
  .max(500)
  .default([]);

export const redeemLoyaltyRewardSchema = z.object({
  rewardId: identifierSchema,
  customerId: identifierSchema,
});

export const loyaltyAdjustmentSchema = z.object({
  customerId: identifierSchema,
  points: z
    .number()
    .int()
    .refine(
      (value) => value !== 0,
      "Point adjustment cannot be zero."
    )
    .refine(
      (value) =>
        Math.abs(value) <= 1_000_000,
      "Point adjustment exceeds the permitted limit."
    ),
  reason: z
    .string()
    .trim()
    .min(
      10,
      "Provide a clear adjustment reason."
    )
    .max(1500),
  reference: z
    .string()
    .trim()
    .max(150)
    .optional()
    .transform((value) =>
      value && value.length > 0
        ? value
        : undefined
    ),
  expiresAt: z
    .string()
    .datetime()
    .optional(),
});

export const loyaltyRewardSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3)
      .max(120),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use a lowercase URL-safe slug."
      ),
    description: z
      .string()
      .trim()
      .min(20)
      .max(2500),
    imageURL: z
      .string()
      .url()
      .optional(),
    type: z.enum([
      "fixedDiscount",
      "percentageDiscount",
      "freeShipping",
      "giftCard",
      "exclusiveAccess",
      "complimentaryGift",
    ]),
    pointsCost: z
      .number()
      .int()
      .positive()
      .max(10_000_000),
    discountPaise: z
      .number()
      .int()
      .positive()
      .optional(),
    percentageBasisPoints: z
      .number()
      .int()
      .min(1)
      .max(10000)
      .optional(),
    maximumDiscountPaise: z
      .number()
      .int()
      .positive()
      .optional(),
    giftCardValuePaise: z
      .number()
      .int()
      .positive()
      .optional(),
    freeShippingMaximumPaise: z
      .number()
      .int()
      .positive()
      .optional(),
    complimentaryProductId: identifierSchema.optional(),
    minimumTier: z
      .enum([
        "atelier",
        "signature",
        "prestige",
        "maison",
      ])
      .optional(),
    minimumOrderPaise: z
      .number()
      .int()
      .nonnegative()
      .optional(),
    eligibleStudioIds:
      optionalIdentifierListSchema,
    eligibleProductIds:
      optionalIdentifierListSchema,
    eligibleCategoryIds:
      optionalIdentifierListSchema,
    firstRedemptionOnly:
      z.boolean(),
    totalRedemptionLimit: z
      .number()
      .int()
      .positive()
      .optional(),
    redemptionLimitPerCustomer: z
      .number()
      .int()
      .positive()
      .optional(),
    validityDaysAfterIssue: z
      .number()
      .int()
      .min(1)
      .max(365),
    startsAt: z
      .string()
      .datetime(),
    endsAt: z
      .string()
      .datetime()
      .optional(),
    featured: z.boolean(),
    sortOrder: z
      .number()
      .int()
      .min(0)
      .max(100000),
  })
  .superRefine(
    (value, context) => {
      if (
        value.type ===
          "fixedDiscount" &&
        !value.discountPaise
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "discountPaise",
          ],
          message:
            "Discount amount is required.",
        });
      }

      if (
        value.type ===
          "percentageDiscount" &&
        !value.percentageBasisPoints
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "percentageBasisPoints",
          ],
          message:
            "Percentage value is required.",
        });
      }

      if (
        value.type ===
          "giftCard" &&
        !value.giftCardValuePaise
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "giftCardValuePaise",
          ],
          message:
            "Gift card value is required.",
        });
      }

      if (
        value.type ===
          "freeShipping" &&
        !value.freeShippingMaximumPaise
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "freeShippingMaximumPaise",
          ],
          message:
            "Maximum shipping value is required.",
        });
      }

      if (
        value.type ===
          "complimentaryGift" &&
        !value.complimentaryProductId
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "complimentaryProductId",
          ],
          message:
            "Complimentary product is required.",
        });
      }

      if (
        value.endsAt &&
        new Date(
          value.endsAt
        ).getTime() <=
          new Date(
            value.startsAt
          ).getTime()
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: ["endsAt"],
          message:
            "End date must be after the start date.",
        });
      }

      if (
        value.totalRedemptionLimit &&
        value.redemptionLimitPerCustomer &&
        value.redemptionLimitPerCustomer >
          value.totalRedemptionLimit
      ) {
        context.addIssue({
          code:
            z.ZodIssueCode
              .custom,
          path: [
            "redemptionLimitPerCustomer",
          ],
          message:
            "Customer limit cannot exceed the total limit.",
        });
      }
    }
  );

export const loyaltyRewardStatusSchema =
  z.object({
    rewardId:
      identifierSchema,
    status: z.enum([
      "draft",
      "active",
      "paused",
      "expired",
      "archived",
    ]),
  });

export const loyaltyTierConfigurationSchema =
  z.object({
    tier: z.enum([
      "atelier",
      "signature",
      "prestige",
      "maison",
    ]),
    displayName: z
      .string()
      .trim()
      .min(2)
      .max(80),
    description: z
      .string()
      .trim()
      .min(10)
      .max(1000),
    minimumLifetimePoints: z
      .number()
      .int()
      .nonnegative(),
    earningMultiplierBasisPoints:
      z
        .number()
        .int()
        .min(10000)
        .max(50000),
    active: z.boolean(),
    sortOrder: z
      .number()
      .int()
      .min(0)
      .max(100),
    benefits: z
      .array(
        z.object({
          id: identifierSchema,
          title: z
            .string()
            .trim()
            .min(2)
            .max(120),
          description: z
            .string()
            .trim()
            .min(5)
            .max(500),
          iconName: z
            .string()
            .trim()
            .max(100)
            .optional(),
        })
      )
      .max(25),
  });

export type RedeemLoyaltyRewardInput =
  z.infer<
    typeof redeemLoyaltyRewardSchema
  >;

export type LoyaltyAdjustmentInput =
  z.infer<
    typeof loyaltyAdjustmentSchema
  >;

export type LoyaltyRewardInput =
  z.infer<
    typeof loyaltyRewardSchema
  >;

export type LoyaltyRewardStatusInput =
  z.infer<
    typeof loyaltyRewardStatusSchema
  >;

export type LoyaltyTierConfigurationInput =
  z.infer<
    typeof loyaltyTierConfigurationSchema
  >;
