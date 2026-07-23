import { z } from "zod";

import {
  documentIdSchema,
  positiveIntegerSchema,
} from "@/lib/schemas/common";

export const cartItemSchema =
 z.object({
   productId:
     documentIdSchema,
   studioId:
     documentIdSchema,
   variantId:
     documentIdSchema.optional(),
   quantity:
     positiveIntegerSchema.max(10),
 });

export const updateCartSchema =
 z.object({
   items: z
     .array(cartItemSchema)
     .max(100),
 });

export const addCartItemSchema =
 cartItemSchema;

export const updateCartQuantitySchema =
 z.object({
   productId:
     documentIdSchema,
   variantId:
     documentIdSchema.optional(),
   quantity:
     positiveIntegerSchema.max(10),
 });

export const removeCartItemSchema =
 z.object({
   productId:
     documentIdSchema,
   variantId:
     documentIdSchema.optional(),
 });
