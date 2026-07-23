import type { CustomOrderStatus } from "@/types/custom-order";

export type CustomOrderDecision =
  | "accept"
  | "requestClarification"
  | "reject";

export type CustomOrderQuoteStatus =
  | "draft"
  | "submitted"
  | "revisionRequested"
  | "accepted"
  | "declined"
  | "expired";

export type CustomOrderProductionStage =
  | "materialsPrepared"
  | "designApproved"
  | "casting"
  | "curing"
  | "finishing"
  | "qualityCheck"
  | "packaging"
  | "completed";

export type CustomOrderPaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partiallyRefunded";

export interface CustomOrderQuote {
  readonly id: string;
  readonly customOrderId: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly amountPaise: number;
  readonly shippingFeePaise: number;
  readonly taxPaise: number;
  readonly platformFeePaise: number;
  readonly totalPaise: number;
  readonly estimatedProductionDays: number;
  readonly revisionNumber: number;
  readonly maximumRevisionCount: 2;
  readonly validUntil: string;
  readonly notes?: string;
  readonly terms?: string;
  readonly status: CustomOrderQuoteStatus;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CustomOrderProductionUpdate {
  readonly id: string;
  readonly customOrderId: string;
  readonly studioId: string;
  readonly stage: CustomOrderProductionStage;
  readonly message: string;
  readonly attachmentURLs: readonly string[];
  readonly customerVisible: boolean;
  readonly createdBy: string;
  readonly createdAt: string;
}

export interface CustomOrderPaymentRecord {
  readonly id: string;
  readonly customOrderId: string;
  readonly quoteId: string;
  readonly status: CustomOrderPaymentStatus;
  readonly amountPaise: number;
  readonly shippingFeePaise: number;
  readonly taxPaise: number;
  readonly platformFeePaise: number;
  readonly totalPaise: number;
  readonly gateway: string;
  readonly gatewayTransactionId?: string;
  readonly paidAt?: string;
  readonly refundedAmountPaise?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CustomOrderAssignment {
  readonly customOrderId: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly assignmentMethod: "automatic" | "manual";
  readonly categoryMatchScore?: number;
  readonly performanceScore?: number;
  readonly assignedBy: string;
  readonly assignedAt: string;
}

export interface CustomOrderTimelineEntry {
  readonly id: string;
  readonly status: CustomOrderStatus;
  readonly title: string;
  readonly description?: string;
  readonly actorId: string;
  readonly actorRole: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}
