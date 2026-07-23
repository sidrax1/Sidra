import { z } from "zod";

import {
  currencyAmountSchema,
  documentIdSchema,
} from "@/lib/schemas/common";

export const submitCustomOrderSchema =
 z
   .object({
    categoryId:
      documentIdSchema,
    studioId:
      documentIdSchema.optional(),
    title: z
      .string()
      .trim()
      .min(5)
      .max(120),
    description: z
      .string()
      .trim()
      .min(50)
      .max(5000),
    quantity: z
      .number()
      .int()
      .positive()
      .max(10_000),

    budgetMinimumPaise:
      currencyAmountSchema.optional(),
    budgetMaximumPaise:
      currencyAmountSchema.optional(),
    requiredBy: z
      .string()
      .datetime({
        offset: true,
      })
      .optional(),
    attachmentPaths: z
      .array(
        z.string().trim().min(1)
      )
      .max(15)
      .default([]),
  })
  .refine(
    (value) =>
      value.budgetMinimumPaise ===
        undefined ||
      value.budgetMaximumPaise ===
        undefined ||
      value.budgetMaximumPaise >=
        value.budgetMinimumPaise,
    {
      message:
        "Maximum budget cannot be lower than minimum budget.",
      path: ["budgetMaximumPaise"],
    }
  );

export const createCustomOrderQuoteSchema =
 z.object({
  customOrderId:
    documentIdSchema,
  amountPaise:
    currencyAmountSchema,
  platformFeePaise:
    currencyAmountSchema,
  shippingFeePaise:
    currencyAmountSchema,
  estimatedCompletionDate: z
    .string()

      .datetime({
        offset: true,
      }),
    notes: z
      .string()
      .trim()
      .max(2000)
      .optional(),
    expiresAt: z
      .string()
      .datetime({
        offset: true,
      }),
  });
