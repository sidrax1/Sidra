import type { Address, BaseEntity } from "@/types/common";

export type CustomOrderStatus =
 | "submitted"
 | "underReview"
 | "awaitingQuote"
 | "quoted"
 | "quoteAccepted"
 | "paymentPending"
 | "paid"
 | "inProduction"
 | "readyForDispatch"
 | "shipped"
 | "delivered"
 | "declined"
 | "cancelled";

export interface CustomOrderAttachment {
  readonly id: string;
  readonly storagePath: string;
  readonly downloadURL: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export interface CustomOrderQuote {
  readonly amountPaise: number;
  readonly platformFeePaise: number;
  readonly shippingFeePaise: number;
  readonly totalAmountPaise: number;
  readonly estimatedCompletionDate: string;
  readonly notes?: string;
  readonly expiresAt: string;
  readonly createdBy: string;
  readonly createdAt: string;
}

export interface CustomOrder extends BaseEntity {
 readonly customerId: string;

 readonly studioId?: string;
 readonly categoryId: string;
 readonly title: string;
 readonly description: string;
 readonly quantity: number;
 readonly budgetMinimumPaise?: number;
 readonly budgetMaximumPaise?: number;
 readonly requiredBy?: string;
 readonly shippingAddress?: Address;
 readonly attachments: readonly CustomOrderAttachment[];
 readonly quote?: CustomOrderQuote;
 readonly status: CustomOrderStatus;
}
