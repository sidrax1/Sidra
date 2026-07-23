import { z } from "zod";

export const documentIdSchema = z
 .string()
 .trim()
 .min(1)
 .max(1500)
 .refine(
   (value) =>
     !value.includes("/") &&
     value !== "." &&
     value !== "..",
   "Invalid document ID."
 );

export const isoDateSchema = z
 .string()
 .datetime({
   offset: true,
 });

export const positiveIntegerSchema = z
 .number()
 .int()
 .positive();

export const nonNegativeIntegerSchema = z
 .number()
 .int()
 .nonnegative();

export const currencyAmountSchema = z
 .number()
 .int()
 .nonnegative()
 .max(1_000_000_000_00);

export const optionalUrlSchema = z
 .string()
 .trim()
 .url()

 .optional();

export const requiredConsentSchema =
  z.literal(true);
