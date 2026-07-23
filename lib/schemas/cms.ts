import { z } from "zod";

import {
  documentIdSchema,
} from "@/lib/schemas/common";
import {
  slugSchema,
} from "@/lib/validation";

export const cmsSeoSchema =
 z.object({
   title: z
     .string()
     .trim()
     .min(10)
     .max(70),
   description: z
     .string()
     .trim()
     .min(50)
     .max(170),
   imageURL: z
     .string()
     .url()
     .optional(),
   noIndex:
     z.boolean().default(false),
 });

export const cmsSectionSchema =
 z.object({
  id: documentIdSchema,

   type: z
     .string()
     .trim()
     .min(2)
     .max(80),
   enabled: z.boolean(),
   order: z
     .number()
     .int()
     .nonnegative(),
   content: z.record(
     z.string(),
     z.unknown()
   ),
 });

export const cmsPageSchema =
  z.object({
    slug: slugSchema,
    title: z
      .string()
      .trim()
      .min(2)
      .max(150),
    status: z.enum([
      "draft",
      "scheduled",
      "published",
      "archived",
    ]),
    sections: z
      .array(cmsSectionSchema)
      .max(100),
    seo: cmsSeoSchema,
    scheduledAt: z
      .string()
      .datetime({
        offset: true,
      })
      .optional(),
  });
