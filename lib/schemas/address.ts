import { z } from "zod";

import {
  emailSchema,
  indianPhoneSchema,
  pincodeSchema,
} from "@/lib/validation";

export const addressSchema = z.object({
 fullName: z
  .string()
  .trim()
  .min(2)
  .max(80),

 phone: indianPhoneSchema,

 email: emailSchema.optional(),

 line1: z
   .string()
   .trim()
   .min(5)
   .max(150),

 line2: z
   .string()
   .trim()
   .max(150)
   .optional(),

 landmark: z
   .string()
   .trim()
   .max(100)
   .optional(),

 city: z
  .string()
  .trim()
  .min(2)
  .max(80),

 district: z
  .string()
  .trim()
  .max(80)
  .optional(),

 state: z
  .string()
  .trim()
  .min(2)
  .max(80),

 country: z
  .string()
  .trim()
  .default("India"),

 postalCode: pincodeSchema,

 defaultShipping:
  z.boolean().default(false),

  defaultBilling:
    z.boolean().default(false),
});

export type AddressInput =
  z.infer<typeof addressSchema>;

export type AddressFormValues =
  z.input<typeof addressSchema>;
