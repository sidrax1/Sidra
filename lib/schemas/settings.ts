import { z } from "zod";

export const platformSettingsSchema =
 z.object({
   maintenanceMode:
     z.boolean(),
   sellerApplicationsEnabled:
     z.boolean(),
   productApprovalRequired:
     z.boolean(),
   reviewModerationRequired:
     z.boolean(),
   defaultCommissionPercentage: z
     .number()
     .min(0)
     .max(100),
   defaultShippingFeePaise: z
     .number()
     .int()
     .nonnegative(),
   freeShippingThresholdPaise: z
     .number()
     .int()
     .nonnegative()
     .nullable(),
   supportEmail: z
     .string()
     .email(),
   legalEntityName: z
     .string()
     .trim()
     .min(2)
     .max(200),
   currency:
     z.literal("INR"),
   country:
     z.literal("IN"),
   timezone:
     z.literal("Asia/Kolkata"),
 });

export const storeCustomizationOptionsSchema =
  z.object({
    themeIds: z
      .array(z.string().trim().min(1))
      .min(1),
    layoutIds: z
      .array(z.string().trim().min(1))
      .min(1),
    fontPairIds: z
      .array(z.string().trim().min(1))
      .min(1),
    spacingIds: z
      .array(z.string().trim().min(1))
      .min(1),
    backgroundIds: z
      .array(z.string().trim().min(1))
      .min(1),
    animationIds: z
      .array(z.string().trim().min(1))
      .min(1),
  });
