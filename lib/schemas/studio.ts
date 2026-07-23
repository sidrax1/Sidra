import { z } from "zod";

import {
  documentIdSchema,
} from "@/lib/schemas/common";
import {
  slugSchema,
} from "@/lib/validation";

export const studioBrandingSchema =
 z.object({
   logoURL: z
     .string()
     .url()
     .nullable(),
   bannerURL: z
     .string()
     .url()
     .nullable(),
   themeId:
     documentIdSchema,
   layoutId:
     documentIdSchema,
   fontPairId:
     documentIdSchema,
   spacingId:
     documentIdSchema,
   backgroundId:
     documentIdSchema,
   animationId:
     documentIdSchema,
 });

export const updateStudioSchema =
 z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .optional(),
  slug:
    slugSchema.optional(),
  description: z
    .string()
    .trim()

     .min(30)
     .max(2000)
     .optional(),
   instagramURL: z
     .string()
     .url()
     .nullable()
     .optional(),
   branding:
     studioBrandingSchema
       .partial()
       .optional(),
 })
 .refine(
   (value) =>
     Object.keys(value).length > 0,
   "At least one studio field is required."
 );

export const studioStatusSchema =
  z.enum([
    "active",
    "suspended",
    "closed",
  ]);
