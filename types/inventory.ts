import type { BaseEntity } from "@/types/common";

export type InventoryStatus =
  | "inStock"
  | "lowStock"
  | "outOfStock"
  | "preorder"
  | "discontinued";

export type InventoryMovementType =
  | "initialStock"
  | "manualAdjustment"
  | "orderReserved"
  | "orderReleased"
  | "orderFulfilled"
  | "returnReceived"
  | "damaged"
  | "lost"
  | "restocked";

export interface InventoryRecord extends BaseEntity {
  readonly productId: string;
  readonly studioId: string;
  readonly sku: string;
  readonly status: InventoryStatus;
  readonly availableQuantity: number;
  readonly reservedQuantity: number;
  readonly incomingQuantity: number;
  readonly reorderThreshold: number;
  readonly allowBackorder: boolean;
  readonly trackInventory: boolean;
  readonly lastRestockedAt?: string;
}

export interface InventoryMovement extends BaseEntity {
  readonly inventoryId: string;
  readonly productId: string;
  readonly studioId: string;
  readonly type: InventoryMovementType;
  readonly quantityChange: number;
  readonly quantityBefore: number;
  readonly quantityAfter: number;
  readonly referenceId?: string;
  readonly reason: string;
  readonly actorId: string;
}

export interface InventoryReservation extends BaseEntity {
  readonly inventoryId: string;
  readonly orderId: string;
  readonly orderItemId: string;
  readonly quantity: number;
  readonly expiresAt: string;
  readonly releasedAt?: string;
  readonly fulfilledAt?: string;
}

export interface InventorySummary {
  readonly totalProducts: number;
  readonly inStockProducts: number;
  readonly lowStockProducts: number;
  readonly outOfStockProducts: number;
  readonly reservedUnits: number;
  readonly availableUnits: number;
}
