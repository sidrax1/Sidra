import { z } from "zod";

import {
  documentIdSchema,
} from "@/lib/schemas/common";

export const createSupportTicketSchema =
 z.object({
  subject: z
    .string()
    .trim()
    .min(5)
    .max(150),
  category: z.enum([
    "account",
    "order",
    "payment",
    "product",
    "studio",
    "customOrder",
    "technical",
    "other",
  ]),

   description: z
     .string()
     .trim()
     .min(20)
     .max(5000),
   priority: z
     .enum([
       "low",
       "normal",
       "high",
       "urgent",
     ])
     .default("normal"),
   orderId:
     documentIdSchema.optional(),
   studioId:
     documentIdSchema.optional(),
   attachmentPaths: z
     .array(
       z.string().trim().min(1)
     )
     .max(10)
     .default([]),
 });

export const addSupportReplySchema =
  z.object({
    ticketId:
      documentIdSchema,
    message: z
      .string()
      .trim()
      .min(1)
      .max(5000),
    attachmentPaths: z
      .array(
        z.string().trim().min(1)
      )
      .max(10)
      .default([]),
  });
