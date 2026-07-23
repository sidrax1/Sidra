import type { BaseEntity } from "@/types/common";

export type RefundStatus =
  | "pending"
  | "approved"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export interface Refund extends BaseEntity {
  readonly refundNumber: string;
  readonly orderId: string;
  readonly paymentId: string;
  readonly amountPaise: number;
  readonly reason: string;
  readonly status: RefundStatus;
  readonly processedBy?: string;
  readonly processedAt?: string;
  readonly transactionReference?: string;
}
