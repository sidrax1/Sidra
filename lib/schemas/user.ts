import { z } from "zod";

import { ROLES } from "@/constants/roles";
import {
  emailSchema,
  indianPhoneSchema,
} from "@/lib/validation";

const userRoles = Object.values(ROLES) as [
  string,
  ...string[],
];

export const userPreferencesSchema =
 z.object({
  preferredLanguage: z
    .enum(["en", "hi"])

     .default("en"),
   emailNotifications:
     z.boolean().default(true),
   pushNotifications:
     z.boolean().default(true),
   marketingConsent:
     z.boolean().default(false),
 });

export const updateUserSchema =
 z.object({
   displayName: z
     .string()
     .trim()
     .min(2)
     .max(60)
     .optional(),
   phoneNumber:
     indianPhoneSchema.optional(),
   profilePhotoURL: z
     .string()
     .url()
     .nullable()
     .optional(),
   preferences:
     userPreferencesSchema
       .partial()
       .optional(),
 });

export const adminUpdateUserRoleSchema =
 z.object({
  userId: z.string().trim().min(1),
  role: z.enum(userRoles),
  studioId: z
    .string()
    .trim()
    .nullable()
    .optional(),
  reason: z
    .string()
    .trim()
    .min(10)
    .max(500),

 });

export const userEmailSchema =
  z.object({
    email: emailSchema,
  });
