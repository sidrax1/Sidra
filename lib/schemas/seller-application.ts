import { z } from "zod";

import {
  documentIdSchema,
} from "@/lib/schemas/common";
import {
  emailSchema,
  indianPhoneSchema,
} from "@/lib/validation";

export const sellerApplicationSchema =
 z.object({

fullName: z
  .string()
  .trim()
  .min(2)
  .max(80),
studioName: z
  .string()
  .trim()
  .min(2)
  .max(100),
email: emailSchema,
mobile: indianPhoneSchema,
city: z
  .string()
  .trim()
  .min(2)
  .max(80),
state: z
  .string()
  .trim()
  .min(2)
  .max(80),
instagramURL: z
  .string()
  .url()
  .optional(),
experience: z
  .string()
  .trim()
  .min(30)
  .max(3000),
categoryIds: z
  .array(documentIdSchema)
  .min(1)
  .max(20),
reasonToJoin: z
  .string()
  .trim()
  .min(30)
  .max(3000),
expectedMonthlyCapacity: z
  .number()
  .int()
  .positive()

     .max(100_000),
   portfolioStoragePaths: z
     .array(
       z.string().trim().min(1)
     )
     .min(3)
     .max(15),
 });

export const reviewSellerApplicationSchema =
  z.object({
    applicationId:
      documentIdSchema,
    decision: z.enum([
      "approve",
      "reject",
      "requestMoreInfo",
      "hold",
    ]),
    reviewNotes: z
      .string()
      .trim()
      .max(2000)
      .optional(),
  })
  .refine(
    (value) =>
      value.decision === "approve" ||
      Boolean(value.reviewNotes),
    {
      message:
        "Review notes are required for this decision.",
      path: ["reviewNotes"],
    }
  );
