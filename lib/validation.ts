import { z } from "zod";

import { REGEX } from "@/constants/regex";

export const emailSchema = z
 .string()
 .trim()
 .toLowerCase()
 .regex(REGEX.EMAIL, "Enter a valid email address.");

export const indianPhoneSchema = z
 .string()
 .trim()
 .regex(REGEX.PHONE, "Enter a valid 10-digit mobile number.");

export const pincodeSchema = z
 .string()
 .trim()
 .regex(REGEX.PINCODE, "Enter a valid Indian PIN code.");

export const slugSchema = z
 .string()

 .trim()
 .regex(REGEX.SLUG, "Enter a valid slug.");

export const displayNameSchema = z
 .string()
 .trim()
 .min(2, "Name must be at least 2 characters.")
 .max(80, "Name must be at most 80 characters.");

export const httpUrlSchema = z
 .string()
 .trim()
 .url("Enter a valid URL.")
 .refine(
   (value) => {
     const protocol = new URL(value).protocol;

     return protocol === "https:" || protocol === "http:";
   },
   {
     message: "Only HTTP and HTTPS URLs are allowed.",
   }
 );

export const nonEmptyTextSchema = (
  minimumLength: number,
  maximumLength: number
): z.ZodString => {
  if (
    !Number.isInteger(minimumLength) ||
    !Number.isInteger(maximumLength) ||
    minimumLength < 1 ||
    maximumLength < minimumLength
  ){
    throw new RangeError("Invalid text validation limits.");
  }

  return z
   .string()
   .trim()
   .min(minimumLength)
   .max(maximumLength);
};

export function parseWithSchema<T>(
  schema: z.ZodType<T>,
  value: unknown
): T {
  return schema.parse(value);
}

export function safeParseWithSchema<T>(
  schema: z.ZodType<T>,
  value: unknown
): z.ZodSafeParseResult<T> {
  return schema.safeParse(value);
}
