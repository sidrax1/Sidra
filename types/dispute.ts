import type { BaseEntity } from "@/types/common";

export type DisputeStatus =
  | "submitted"
  | "underReview"
  | "evidenceRequired"
  | "merchantResponseRequired"
  | "escalated"
  | "resolvedForCustomer"
  | "resolvedForStudio"
  | "partiallyResolved"
  | "withdrawn"
  | "closed";

export type DisputeReason =
  | "orderNotReceived"
  | "itemDamaged"
  | "itemNotAsDescribed"
  | "wrongItem"
  | "unauthorizedPayment"
  | "duplicatePayment"
  | "refundNotReceived"
  | "sellerNonResponsive"
  | "serviceNotDelivered"
  | "other";

export type DisputeResolution =
  | "fullRefund"
  | "partialRefund"
  | "replacement"
  | "storeCredit"
  | "releasePayment"
  | "denyClaim"
  | "mutualSettlement";

export type DisputeParticipantRole =
  | "customer"
  | "studio"
  | "support"
  | "admin"
  | "compliance"
  | "system";

export interface DisputeEvidence {
  readonly id: string;
  readonly uploadedBy: string;
  readonly uploaderRole: DisputeParticipantRole;
  readonly storagePath: string;
  readonly downloadURL: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly description?: string;
  readonly createdAt: string;
}

export interface DisputeOrderSnapshot {
  readonly orderId: string;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly customerEmail: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly orderTotalPaise: number;
  readonly paymentStatus: string;
  readonly fulfilmentStatus: string;
  readonly placedAt: string;
}

export interface DisputeAssignment {
  readonly assignedTo: string;
  readonly assignedBy: string;
  readonly assignedAt: string;
  readonly team:
    | "support"
    | "payments"
    | "compliance"
    | "legal";
}

export interface DisputeFinancialImpact {
  readonly disputedAmountPaise: number;
  readonly approvedRefundPaise: number;
  readonly withheldSettlementPaise: number;
  readonly releasedSettlementPaise: number;
  readonly platformLossPaise: number;
  readonly currency: "INR";
}

export interface DisputeDecision {
  readonly resolution: DisputeResolution;
  readonly reason: string;
  readonly customerMessage: string;
  readonly studioMessage: string;
  readonly internalNote?: string;
  readonly decidedBy: string;
  readonly decidedAt: string;
  readonly appealAllowed: boolean;
  readonly appealDeadline?: string;
}

export interface Dispute extends BaseEntity {
  readonly disputeNumber: string;
  readonly order: DisputeOrderSnapshot;
  readonly openedBy: string;
  readonly openedByRole: "customer" | "studio" | "admin";
  readonly status: DisputeStatus;
  readonly reason: DisputeReason;
  readonly title: string;
  readonly description: string;
  readonly customerRequestedResolution: DisputeResolution;
  readonly studioResponse?: string;
  readonly evidence: readonly DisputeEvidence[];
  readonly assignment?: DisputeAssignment;
  readonly financialImpact: DisputeFinancialImpact;
  readonly decision?: DisputeDecision;
  readonly riskScore: number;
  readonly priority:
    | "low"
    | "normal"
    | "high"
    | "urgent";
  readonly responseDueAt: string;
  readonly escalatedAt?: string;
  readonly resolvedAt?: string;
  readonly closedAt?: string;
}

export interface DisputeTimelineEvent extends BaseEntity {
  readonly disputeId: string;
  readonly status: DisputeStatus;
  readonly title: string;
  readonly description?: string;
  readonly actorId: string;
  readonly actorRole: DisputeParticipantRole;
  readonly customerVisible: boolean;
  readonly studioVisible: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface DisputeMessage extends BaseEntity {
  readonly disputeId: string;
  readonly senderId: string;
  readonly senderRole: DisputeParticipantRole;
  readonly senderName: string;
  readonly senderPhotoURL?: string | null;
  readonly message: string;
  readonly attachmentURLs: readonly string[];
  readonly internal: boolean;
  readonly readBy: readonly string[];
}

export interface DisputeAnalytics {
  readonly totalDisputes: number;
  readonly openDisputes: number;
  readonly urgentDisputes: number;
  readonly resolvedForCustomer: number;
  readonly resolvedForStudio: number;
  readonly averageResolutionHours: number;
  readonly disputedValuePaise: number;
  readonly refundedValuePaise: number;
  readonly recoveredValuePaise: number;
}
