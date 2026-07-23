import { z } from "zod";

import {
  currencyAmountSchema,
} from "@/lib/schemas/common";
import {
  emailSchema,
  indianPhoneSchema,
} from "@/lib/validation";

export const corporateLeadSchema =
 z.object({
  companyName: z
    .string()
    .trim()
    .min(2)
    .max(150),
  contactName: z
    .string()
    .trim()
    .min(2)
    .max(80),
  email: emailSchema,
  phone:
    indianPhoneSchema,
  city: z
    .string()
    .trim()
    .min(2)
    .max(80),
  requirement: z
    .string()
    .trim()
    .min(30)
    .max(5000),
  estimatedQuantity: z
    .number()
    .int()
    .positive()
    .max(1_000_000),
  estimatedBudgetPaise:
    currencyAmountSchema.optional(),
  requiredBy: z
    .string()

        .datetime({
          offset: true,
        })
        .optional(),
  });
