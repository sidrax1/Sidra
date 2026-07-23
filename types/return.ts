import type { BaseEntity } from "@/types/common";

export type ReturnStatus =
  | "requested"
  | "underReview"
  | "approved"
  | "rejected"
  | "pickupScheduled"
  | "inTransit"
  | "received"
  | "inspectionInProgress"
  | "inspectionPassed"
  | "inspectionFailed"
  | "refundInitiated"
  | "replacementInitiated"
  | "completed"
  | "cancelled";

export type ReturnReason =
  | "damaged"
  | "defective"
  | "wrongItem"
  | "notAsDescribed"
  | "missingParts"
  | "qualityConcern"
  | "sizeOrDimensionIssue"
  | "changedMind"
  | "lateDelivery"
  | "other";

export type ReturnResolution =
  | "refund"
  | "replacement"
  | "repair"
  | "storeCredit";

export type ReturnPickupStatus =
  | "notRequired"
  | "pending"
  | "scheduled"
  | "attempted"
  | "pickedUp"
  | "cancelled"
  | "failed";

export type ReturnInspectionStatus =
  | "notStarted"
  | "inProgress"
  | "passed"
  | "partiallyPassed"
  | "failed";

export interface ReturnItemSnapshot {
  readonly orderItemId: string;
  readonly productId: string;
  readonly productTitle: string;
  readonly productSlug: string;
  readonly productImageURL?: string;
  readonly variantId?: string;
  readonly variantTitle?: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly orderedQuantity: number;
  readonly returnQuantity: number;
  readonly unitPricePaise: number;
  readonly totalValuePaise: number;
}

export interface ReturnEvidence {
  readonly id: string;
  readonly uploadedBy: string;
  readonly storagePath: string;
  readonly downloadURL: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly description?: string;
  readonly createdAt: string;
}

export interface ReturnAddress {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly landmark?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly countryCode: "IN";
}

export interface ReturnPickup {
  readonly required: boolean;
  readonly status: ReturnPickupStatus;
  readonly address?: ReturnAddress;
  readonly logisticsProvider?: string;
  readonly trackingNumber?: string;
  readonly trackingURL?: string;
  readonly pickupScheduledAt?: string;
  readonly pickupCompletedAt?: string;
  readonly attemptedAt?: string;
  readonly failureReason?: string;
}

export interface ReturnInspectionFinding {
  readonly id: string;
  readonly label: string;
  readonly passed: boolean;
  readonly note?: string;
}

export interface ReturnInspection {
  readonly status: ReturnInspectionStatus;
  readonly inspectedBy?: string;
  readonly inspectedAt?: string;
  readonly findings: readonly ReturnInspectionFinding[];
  readonly acceptedQuantity: number;
  readonly rejectedQuantity: number;
  readonly conditionScore?: number;
  readonly internalNote?: string;
  readonly customerNote?: string;
  readonly evidence: readonly ReturnEvidence[];
}

export interface ReturnFinancialSummary {
  readonly itemValuePaise: number;
  readonly shippingRefundPaise: number;
  readonly taxRefundPaise: number;
  readonly restockingFeePaise: number;
  readonly deductionPaise: number;
  readonly finalRefundPaise: number;
  readonly currency: "INR";
}

export interface ReturnDecision {
  readonly approved: boolean;
  readonly resolution?: ReturnResolution;
  readonly reason: string;
  readonly customerMessage: string;
  readonly decidedBy: string;
  readonly decidedAt: string;
}

export interface ReturnRequest extends BaseEntity {
  readonly returnNumber: string;
  readonly orderId: string;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly customerEmail: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly item: ReturnItemSnapshot;
  readonly reason: ReturnReason;
  readonly resolutionRequested: ReturnResolution;
  readonly description: string;
  readonly status: ReturnStatus;
  readonly priority: "low" | "normal" | "high" | "urgent";
  readonly evidence: readonly ReturnEvidence[];
  readonly pickup: ReturnPickup;
  readonly inspection: ReturnInspection;
  readonly financialSummary: ReturnFinancialSummary;
  readonly decision?: ReturnDecision;
  readonly returnWindowExpiresAt: string;
  readonly responseDueAt: string;
  readonly approvedAt?: string;
  readonly rejectedAt?: string;
  readonly completedAt?: string;
  readonly cancelledAt?: string;
}

export interface ReturnTimelineEvent extends BaseEntity {
  readonly returnId: string;
  readonly status: ReturnStatus;
  readonly title: string;
  readonly description?: string;
  readonly actorId: string;
  readonly actorRole:
    | "customer"
    | "studio"
    | "support"
    | "admin"
    | "system"
    | "logistics";
  readonly customerVisible: boolean;
  readonly studioVisible: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ReturnAnalytics {
  readonly totalReturns: number;
  readonly openReturns: number;
  readonly pendingReviewReturns: number;
  readonly pickupScheduledReturns: number;
  readonly inspectionPendingReturns: number;
  readonly completedReturns: number;
  readonly rejectedReturns: number;
  readonly returnValuePaise: number;
  readonly refundedValuePaise: number;
  readonly restockingFeesPaise: number;
  readonly averageResolutionHours: number;
  readonly returnRatePercentage: number;
}
