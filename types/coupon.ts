import type { BaseEntity } from "@/types/common";

export type CouponType =
 | "percentage"
 | "fixed";

export interface Coupon extends BaseEntity {
 readonly code: string;

 readonly type: CouponType;

 readonly value: number;

 readonly minimumOrderValue: number;

 readonly maximumDiscount?: number;

 readonly usageLimit: number;

 readonly active: boolean;

  readonly expiryDate: string;
}
