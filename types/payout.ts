import type { BaseEntity } from "@/types/common";

export type PayoutStatus =
 | "pending"
 | "approved"
 | "processing"
 | "paid"
 | "failed"
 | "held";

export interface Payout extends BaseEntity {
  readonly studioId: string;
  readonly sellerId: string;
  readonly orderIds: readonly string[];
  readonly currency: "INR";
  readonly grossAmountPaise: number;
  readonly platformFeePaise: number;
  readonly taxAmountPaise: number;
  readonly adjustmentAmountPaise: number;
  readonly netAmountPaise: number;
  readonly status: PayoutStatus;
  readonly providerReference?: string;
  readonly approvedBy?: string;
  readonly approvedAt?: string;
  readonly processedAt?: string;
  readonly failureReason?: string;
}
