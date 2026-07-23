import { z } from "zod";

import {
  currencyAmountSchema,
  documentIdSchema,
} from "@/lib/schemas/common";
import { slugSchema } from "@/lib/validation";

export const productImageSchema =
 z.object({
   id: documentIdSchema,
   url: z.string().url(),
   storagePath: z
     .string()
     .trim()
     .min(1),
   alt: z
     .string()
     .trim()
     .min(2)
     .max(150),
   width: z
     .number()
     .int()
     .positive(),
   height: z
     .number()
     .int()
     .positive(),
   order: z
     .number()
     .int()
     .nonnegative(),
 });

export const productVariantSchema =
 z.object({
  id: documentIdSchema,
  title: z
    .string()
    .trim()

     .min(1)
     .max(80),
   sku: z
     .string()
     .trim()
     .min(2)
     .max(80),
   pricePaise:
     currencyAmountSchema,
   compareAtPricePaise:
     currencyAmountSchema.optional(),
   availableQuantity: z
     .number()
     .int()
     .nonnegative(),
   active: z.boolean(),
 });

export const createProductSchema =
 z.object({
  studioId: documentIdSchema,
  title: z
    .string()
    .trim()
    .min(5)
    .max(120),
  slug: slugSchema,
  description: z
    .string()
    .trim()
    .min(30)
    .max(5000),
  categoryId: documentIdSchema,
  collectionIds: z
    .array(documentIdSchema)
    .max(20)
    .default([]),
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(2)
        .max(40)

     )
     .max(30)
     .default([]),
   pricePaise:
     currencyAmountSchema,
   compareAtPricePaise:
     currencyAmountSchema.optional(),
   images: z
     .array(productImageSchema)
     .min(1)
     .max(10),
   variants: z
     .array(productVariantSchema)
     .max(100)
     .default([]),
   trackInventory:
     z.boolean().default(true),
   active:
     z.boolean().default(false),
 })
 .refine(
   (product) =>
     product.compareAtPricePaise ===
       undefined ||
     product.compareAtPricePaise >
       product.pricePaise,
   {
     message:
       "Compare-at price must be greater than the selling price.",
     path: ["compareAtPricePaise"],
   }
 );

export type CreateProductInput =
  z.infer<typeof createProductSchema>;
