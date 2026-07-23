import type { BaseEntity } from "@/types/common";

export type PromotionStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "expired"
  | "archived";

export type PromotionType =
  | "percentage"
  | "fixedAmount"
  | "freeShipping"
  | "buyXGetY";

export type PromotionAudience =
  | "allCustomers"
  | "newCustomers"
  | "returningCustomers"
  | "selectedCustomers";

export interface PromotionValue {
  readonly type: PromotionType;
  readonly percentageBasisPoints?: number;
  readonly fixedAmountPaise?: number;
  readonly buyQuantity?: number;
  readonly rewardQuantity?: number;
}

export interface PromotionEligibility {
  readonly audience: PromotionAudience;
  readonly minimumOrderPaise?: number;
  readonly maximumDiscountPaise?: number;
  readonly productIds: readonly string[];
  readonly categoryIds: readonly string[];
  readonly studioIds: readonly string[];
  readonly customerIds: readonly string[];
  readonly firstOrderOnly: boolean;
}

export interface PromotionUsageLimits {
  readonly totalUsageLimit?: number;
  readonly usageLimitPerCustomer?: number;
  readonly usageCount: number;
}

export interface Promotion extends BaseEntity {
  readonly name: string;
  readonly description?: string;
  readonly code?: string;
  readonly status: PromotionStatus;
  readonly value: PromotionValue;
  readonly eligibility: PromotionEligibility;
  readonly usage: PromotionUsageLimits;
  readonly combinable: boolean;
  readonly automatic: boolean;
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly createdBy: string;
  readonly updatedBy: string;
}

export interface PromotionRedemption extends BaseEntity {
  readonly promotionId: string;
  readonly orderId: string;
  readonly customerId: string;
  readonly code?: string;
  readonly discountPaise: number;
  readonly redeemedAt: string;
}
