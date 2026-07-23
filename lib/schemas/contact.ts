import { z } from "zod";

import {
  requiredConsentSchema,
} from "@/lib/schemas/common";
import {
  emailSchema,
  indianPhoneSchema,

} from "@/lib/validation";

export const contactRequestSchema =
 z.object({
   fullName: z
     .string()
     .trim()
     .min(2)
     .max(80),
   email: emailSchema,
   phone:
     indianPhoneSchema.optional(),
   subject: z
     .string()
     .trim()
     .min(5)
     .max(150),
   message: z
     .string()
     .trim()
     .min(20)
     .max(5000),
   consent:
     requiredConsentSchema,
 });

export const newsletterSubscriptionSchema =
  z.object({
    email: emailSchema,
    source: z
      .string()
      .trim()
      .min(2)
      .max(100),
    consent:
      requiredConsentSchema,
  });
