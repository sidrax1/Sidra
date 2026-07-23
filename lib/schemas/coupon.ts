import { z } from "zod";

import {
  currencyAmountSchema,
} from "@/lib/schemas/common";

export const couponSchema =
 z
   .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .regex(
        /^[A-Z0-9_-]{3,40}$/,
        "Coupon code contains unsupported characters."
      ),
    type: z.enum([
      "percentage",
      "fixed",
    ]),
    value: z
      .number()
      .positive(),
    minimumOrderValuePaise:
      currencyAmountSchema.default(0),
    maximumDiscountPaise:
      currencyAmountSchema.optional(),
    usageLimit: z
      .number()
      .int()
      .positive(),
    perUserLimit: z
      .number()
      .int()
      .positive()
      .default(1),
    active: z.boolean(),
    startsAt: z
      .string()

          .datetime({
            offset: true,
          }),
        expiresAt: z
          .string()
          .datetime({
            offset: true,
          }),
      })
      .refine(
        (coupon) =>
          coupon.type !== "percentage" ||
          coupon.value <= 100,
        {
          message:
            "Percentage discount cannot exceed 100.",
          path: ["value"],
        }
      )
      .refine(
        (coupon) =>
          coupon.expiresAt >
          coupon.startsAt,
        {
          message:
            "Expiry must be after the start time.",
          path: ["expiresAt"],
        }
      );
