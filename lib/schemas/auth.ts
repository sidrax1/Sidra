import { z } from "zod";

import {
  displayNameSchema,
  emailSchema,
} from "@/lib/validation";

export const googleProfileSchema =
 z.object({
   uid: z.string().trim().min(1),
   email: emailSchema,
   displayName: displayNameSchema,
   photoURL: z
     .string()
     .url()
     .nullable()
     .optional(),
   emailVerified: z.boolean(),
 });

export const createSessionSchema =
 z.object({
   idToken: z
     .string()
     .trim()
     .min(100)
     .max(10_000),
 });

export const updateProfileSchema =
 z
   .object({
    displayName:

         displayNameSchema.optional(),
        photoURL: z
         .string()
         .url()
         .nullable()
         .optional(),
        phoneNumber: z
         .string()
         .trim()
         .regex(
           /^[6-9]\d{9}$/,
           "Enter a valid Indian mobile number."
         )
         .optional(),
      })
      .refine(
        (value) =>
         Object.keys(value).length > 0,
        "At least one profile field is required."
      );
