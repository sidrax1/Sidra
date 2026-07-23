import { z } from "zod";

const identifierSchema = z.string().trim().min(1);

const optionalIdentifierArray = z
  .array(identifierSchema)
  .max(500)
  .default([]);

export const promotionSchema = z
  .object({
    name: z.string().trim().min(3).max(120),
    description: z.string().trim().max(1000).optional(),
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z0-9_-]{3,30}$/)
      .optional(),
    type: z.enum([
      "percentage",
      "fixedAmount",
      "freeShipping",
      "buyXGetY",
    ]),
    percentageBasisPoints: z
      .number()
      .int()
      .min(1)
      .max(10000)
      .optional(),
    fixedAmountPaise: z
      .number()
      .int()
      .positive()
      .optional(),
    buyQuantity: z.number().int().positive().optional(),
    rewardQuantity: z.number().int().positive().optional(),
    audience: z.enum([
      "allCustomers",
      "newCustomers",
      "returningCustomers",
      "selectedCustomers",
    ]),
    minimumOrderPaise: z.number().int().nonnegative().optional(),
    maximumDiscountPaise: z.number().int().positive().optional(),
    productIds: optionalIdentifierArray,
    categoryIds: optionalIdentifierArray,
    studioIds: optionalIdentifierArray,
    customerIds: optionalIdentifierArray,
    firstOrderOnly: z.boolean(),
    totalUsageLimit: z.number().int().positive().optional(),
    usageLimitPerCustomer: z.number().int().positive().optional(),
    combinable: z.boolean(),
    automatic: z.boolean(),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime().optional(),
  })
  .superRefine((value, context) => {
    if (value.type === "percentage" && !value.percentageBasisPoints) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["percentageBasisPoints"],
        message: "Percentage value is required.",
      });
    }

    if (value.type === "fixedAmount" && !value.fixedAmountPaise) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fixedAmountPaise"],
        message: "Fixed discount amount is required.",
      });
    }

    if (
      value.type === "buyXGetY" &&
      (!value.buyQuantity || !value.rewardQuantity)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["buyQuantity"],
        message: "Buy and reward quantities are required.",
      });
    }

    if (!value.automatic && !value.code) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["code"],
        message: "A coupon code is required.",
      });
    }

    if (
      value.endsAt &&
      new Date(value.endsAt).getTime() <=
        new Date(value.startsAt).getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "End date must be after the start date.",
      });
    }

    if (
      value.audience === "selectedCustomers" &&
      value.customerIds.length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customerIds"],
        message: "Select at least one customer.",
      });
    }
  });

export const validatePromotionCodeSchema = z.object({
  code: z.string().trim().toUpperCase().min(3).max(30),
  customerId: identifierSchema,
  studioId: identifierSchema,
  cartItems: z
    .array(
      z.object({
        productId: identifierSchema,
        categoryId: identifierSchema,
        quantity: z.number().int().positive(),
        unitPricePaise: z.number().int().nonnegative(),
      })
    )
    .min(1)
    .max(100),
});

export const promotionStatusSchema = z.object({
  promotionId: identifierSchema,
  status: z.enum([
    "draft",
    "scheduled",
    "active",
    "paused",
    "expired",
    "archived",
  ]),
});

export type PromotionInput = z.infer<typeof promotionSchema>;

export type ValidatePromotionCodeInput = z.infer<
  typeof validatePromotionCodeSchema
>;

export type PromotionStatusInput = z.infer<
  typeof promotionStatusSchema
>;
