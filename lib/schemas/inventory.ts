import { z } from "zod";

const identifierSchema = z.string().trim().min(1);

export const inventoryAdjustmentSchema = z.object({
  inventoryId: identifierSchema,
  quantityChange: z
    .number()
    .int()
    .refine(
      (value) => value !== 0,
      "Quantity adjustment cannot be zero."
    ),
  reason: z.string().trim().min(5).max(1000),
  referenceId: z.string().trim().optional(),
});

export const inventorySettingsSchema = z.object({
  inventoryId: identifierSchema,
  reorderThreshold: z.number().int().nonnegative(),
  allowBackorder: z.boolean(),
  trackInventory: z.boolean(),
});

export const inventoryRestockSchema = z.object({
  inventoryId: identifierSchema,
  quantity: z.number().int().positive(),
  supplierReference: z.string().trim().max(150).optional(),
  receivedAt: z.string().datetime(),
  note: z.string().trim().max(1000).optional(),
});

export const inventoryDamageSchema = z.object({
  inventoryId: identifierSchema,
  quantity: z.number().int().positive(),
  reason: z.string().trim().min(5).max(1000),
  evidencePaths: z
    .array(z.string().trim().min(1))
    .max(10),
});

export type InventoryAdjustmentInput = z.infer<
  typeof inventoryAdjustmentSchema
>;

export type InventorySettingsInput = z.infer<
  typeof inventorySettingsSchema
>;

export type InventoryRestockInput = z.infer<
  typeof inventoryRestockSchema
>;

export type InventoryDamageInput = z.infer<
  typeof inventoryDamageSchema
>;
