import type { BaseEntity } from "@/types/common";

export type WarrantyStatus =
  | "active"
  | "expired"
  | "void"
  | "transferred"
  | "claimInProgress"
  | "fulfilled";

export type WarrantyCoverageType =
  | "manufacturingDefect"
  | "structuralFailure"
  | "finishDefect"
  | "hardwareFailure"
  | "electricalFailure"
  | "accidentalDamage"
  | "extendedCare"
  | "customCoverage";

export type WarrantyClaimStatus =
  | "submitted"
  | "underReview"
  | "evidenceRequired"
  | "approved"
  | "rejected"
  | "repairScheduled"
  | "replacementApproved"
  | "refundApproved"
  | "inService"
  | "completed"
  | "cancelled";

export type WarrantyClaimResolution =
  | "repair"
  | "replacement"
  | "partialRefund"
  | "fullRefund"
  | "storeCredit"
  | "claimRejected";

export type WarrantyPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface WarrantyCoverageItem {
  readonly id: string;
  readonly type: WarrantyCoverageType;
  readonly title: string;
  readonly description: string;
  readonly maximumClaims?: number;
  readonly maximumCoveragePaise?: number;
  readonly deductiblePaise?: number;
  readonly active: boolean;
}

export interface WarrantyExclusion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface WarrantyProductSnapshot {
  readonly productId: string;
  readonly productTitle: string;
  readonly productSlug: string;
  readonly productImageURL?: string;
  readonly variantId?: string;
  readonly variantTitle?: string;
  readonly serialNumber?: string;
  readonly studioId: string;
  readonly studioName: string;
  readonly orderId: string;
  readonly orderNumber: string;
  readonly orderItemId: string;
  readonly purchasedAt: string;
  readonly deliveredAt?: string;
  readonly purchaseValuePaise: number;
}

export interface WarrantyOwnerSnapshot {
  readonly customerId: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerPhone?: string;
}

export interface ProductWarranty extends BaseEntity {
  readonly warrantyNumber: string;
  readonly status: WarrantyStatus;
  readonly product: WarrantyProductSnapshot;
  readonly owner: WarrantyOwnerSnapshot;
  readonly startsAt: string;
  readonly expiresAt: string;
  readonly durationMonths: number;
  readonly coverage: readonly WarrantyCoverageItem[];
  readonly exclusions: readonly WarrantyExclusion[];
  readonly transferable: boolean;
  readonly transferredAt?: string;
  readonly previousOwnerId?: string;
  readonly claimCount: number;
  readonly maximumClaimCount?: number;
  readonly registrationRequired: boolean;
  readonly registeredAt?: string;
  readonly registrationReference?: string;
  readonly termsVersion: string;
  readonly issuedBy: string;
  readonly voidedAt?: string;
  readonly voidReason?: string;
}

export interface WarrantyClaimEvidence {
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

export interface WarrantyClaimAssessment {
  readonly coverageItemId?: string;
  readonly covered: boolean;
  readonly reason: string;
  readonly estimatedServiceCostPaise: number;
  readonly approvedCoveragePaise: number;
  readonly deductiblePaise: number;
  readonly customerPayablePaise: number;
  readonly assessedBy: string;
  readonly assessedAt: string;
}

export interface WarrantyClaimDecision {
  readonly approved: boolean;
  readonly resolution: WarrantyClaimResolution;
  readonly reason: string;
  readonly customerMessage: string;
  readonly internalNote?: string;
  readonly decidedBy: string;
  readonly decidedAt: string;
}

export interface WarrantyServiceAddress {
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

export interface WarrantyServiceAppointment {
  readonly appointmentId: string;
  readonly serviceMode:
    | "pickup"
    | "dropOff"
    | "onSite"
    | "remoteAssessment";
  readonly scheduledAt: string;
  readonly address?: WarrantyServiceAddress;
  readonly servicePartnerId?: string;
  readonly servicePartnerName?: string;
  readonly logisticsProvider?: string;
  readonly trackingNumber?: string;
  readonly trackingURL?: string;
  readonly completedAt?: string;
}

export interface WarrantyClaim extends BaseEntity {
  readonly claimNumber: string;
  readonly warrantyId: string;
  readonly warrantyNumber: string;
  readonly customerId: string;
  readonly studioId: string;
  readonly product: WarrantyProductSnapshot;
  readonly status: WarrantyClaimStatus;
  readonly priority: WarrantyPriority;
  readonly issueTitle: string;
  readonly issueDescription: string;
  readonly failureDate: string;
  readonly requestedResolution: Exclude<
    WarrantyClaimResolution,
    "claimRejected"
  >;
  readonly coverageType?: WarrantyCoverageType;
  readonly evidence: readonly WarrantyClaimEvidence[];
  readonly assessment?: WarrantyClaimAssessment;
  readonly decision?: WarrantyClaimDecision;
  readonly serviceAppointment?: WarrantyServiceAppointment;
  readonly responseDueAt: string;
  readonly approvedAt?: string;
  readonly rejectedAt?: string;
  readonly completedAt?: string;
  readonly cancelledAt?: string;
}

export interface WarrantyTimelineEvent extends BaseEntity {
  readonly warrantyId?: string;
  readonly claimId?: string;
  readonly title: string;
  readonly description?: string;
  readonly status:
    | WarrantyStatus
    | WarrantyClaimStatus;
  readonly actorId: string;
  readonly actorRole:
    | "customer"
    | "studio"
    | "support"
    | "admin"
    | "servicePartner"
    | "system";
  readonly customerVisible: boolean;
  readonly studioVisible: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface WarrantyAnalytics {
  readonly totalWarranties: number;
  readonly activeWarranties: number;
  readonly expiringWithinThirtyDays: number;
  readonly expiredWarranties: number;
  readonly openClaims: number;
  readonly approvedClaims: number;
  readonly rejectedClaims: number;
  readonly completedClaims: number;
  readonly approvedCoverageValuePaise: number;
  readonly customerDeductibleValuePaise: number;
  readonly averageClaimResolutionHours: number;
  readonly claimRatePercentage: number;
}
