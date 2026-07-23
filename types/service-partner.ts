import type { BaseEntity } from "@/types/common";

export type ServicePartnerStatus =
  | "pendingVerification"
  | "active"
  | "temporarilyUnavailable"
  | "suspended"
  | "rejected"
  | "archived";

export type ServicePartnerType =
  | "repairStudio"
  | "inspectionCentre"
  | "logisticsPartner"
  | "installationPartner"
  | "restorationSpecialist"
  | "qualityAssuranceCentre"
  | "multiServicePartner";

export type ServicePartnerCapability =
  | "productInspection"
  | "resinRepair"
  | "surfaceRestoration"
  | "structuralRepair"
  | "hardwareReplacement"
  | "electricalRepair"
  | "customisationCorrection"
  | "pickup"
  | "reverseLogistics"
  | "replacementDelivery"
  | "onSiteService"
  | "remoteAssessment"
  | "qualityCertification"
  | "securePackaging";

export type ServicePartnerVerificationStatus =
  | "notStarted"
  | "documentsPending"
  | "underReview"
  | "siteInspectionPending"
  | "verified"
  | "failed"
  | "expired";

export interface ServicePartnerAddress {
  readonly fullName: string;
  readonly phoneNumber: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly landmark?: string;
  readonly city: string;
  readonly district?: string;
  readonly state: string;
  readonly postalCode: string;
  readonly countryCode: "IN";
  readonly latitude?: number;
  readonly longitude?: number;
}

export interface ServicePartnerOperatingHours {
  readonly day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  readonly open: boolean;
  readonly opensAt?: string;
  readonly closesAt?: string;
}

export interface ServicePartnerContact {
  readonly contactName: string;
  readonly designation?: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly alternatePhoneNumber?: string;
  readonly websiteURL?: string;
}

export interface ServicePartnerCoverageArea {
  readonly id: string;
  readonly state: string;
  readonly cities: readonly string[];
  readonly postalCodes?: readonly string[];
  readonly serviceRadiusKilometres?: number;
  readonly pickupAvailable: boolean;
  readonly onSiteServiceAvailable: boolean;
}

export interface ServicePartnerCapabilityProfile {
  readonly capability: ServicePartnerCapability;
  readonly active: boolean;
  readonly description?: string;
  readonly minimumTurnaroundHours?: number;
  readonly maximumTurnaroundHours?: number;
  readonly baseServiceFeePaise?: number;
  readonly inspectionFeePaise?: number;
  readonly pickupFeePaise?: number;
}

export interface ServicePartnerDocument {
  readonly id: string;
  readonly type:
    | "pan"
    | "gst"
    | "udyam"
    | "businessRegistration"
    | "bankProof"
    | "addressProof"
    | "insurance"
    | "qualityCertificate"
    | "serviceAgreement"
    | "identityProof"
    | "other";
  readonly fileName: string;
  readonly storagePath: string;
  readonly downloadURL: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly uploadedAt: string;
  readonly expiresAt?: string;
  readonly verified: boolean;
  readonly verifiedBy?: string;
  readonly verifiedAt?: string;
  readonly rejectionReason?: string;
}

export interface ServicePartnerBankAccount {
  readonly accountHolderName: string;
  readonly accountNumberLastFour: string;
  readonly bankName: string;
  readonly branchName?: string;
  readonly ifscCode: string;
  readonly accountType:
    | "current"
    | "savings";
  readonly verified: boolean;
  readonly verifiedAt?: string;
}

export interface ServicePartnerVerification {
  readonly status: ServicePartnerVerificationStatus;
  readonly submittedAt?: string;
  readonly reviewedAt?: string;
  readonly reviewedBy?: string;
  readonly siteInspectionAt?: string;
  readonly siteInspectionBy?: string;
  readonly failureReason?: string;
  readonly expiresAt?: string;
  readonly riskScore: number;
}

export interface ServicePartnerPerformance {
  readonly totalAssignments: number;
  readonly completedAssignments: number;
  readonly cancelledAssignments: number;
  readonly activeAssignments: number;
  readonly averageCompletionHours: number;
  readonly firstResponseMinutes: number;
  readonly customerRating: number;
  readonly customerReviewCount: number;
  readonly qualityScore: number;
  readonly resolutionSuccessRate: number;
  readonly repeatServiceRate: number;
  readonly disputeCount: number;
}

export interface ServicePartnerSettlementProfile {
  readonly commissionPercentage: number;
  readonly platformFeePercentage: number;
  readonly taxDeductionPercentage: number;
  readonly settlementCycle:
    | "daily"
    | "weekly"
    | "fortnightly"
    | "monthly";
  readonly minimumSettlementPaise: number;
  readonly settlementHoldDays: number;
  readonly bankAccount?: ServicePartnerBankAccount;
}

export interface ServicePartner extends BaseEntity {
  readonly partnerNumber: string;
  readonly legalName: string;
  readonly displayName: string;
  readonly slug: string;
  readonly description: string;
  readonly partnerType: ServicePartnerType;
  readonly status: ServicePartnerStatus;
  readonly logoURL?: string;
  readonly coverImageURL?: string;
  readonly contact: ServicePartnerContact;
  readonly registeredAddress: ServicePartnerAddress;
  readonly serviceAddress?: ServicePartnerAddress;
  readonly operatingHours: readonly ServicePartnerOperatingHours[];
  readonly coverageAreas: readonly ServicePartnerCoverageArea[];
  readonly capabilities: readonly ServicePartnerCapabilityProfile[];
  readonly documents: readonly ServicePartnerDocument[];
  readonly verification: ServicePartnerVerification;
  readonly performance: ServicePartnerPerformance;
  readonly settlementProfile: ServicePartnerSettlementProfile;
  readonly gstNumber?: string;
  readonly panNumberMasked?: string;
  readonly udyamNumber?: string;
  readonly acceptingAssignments: boolean;
  readonly maximumConcurrentAssignments: number;
  readonly currentAssignmentCount: number;
  readonly notes?: string;
  readonly activatedAt?: string;
  readonly suspendedAt?: string;
  readonly suspensionReason?: string;
  readonly archivedAt?: string;
}

export interface ServicePartnerApplication extends BaseEntity {
  readonly applicationNumber: string;
  readonly applicantUserId: string;
  readonly legalName: string;
  readonly displayName: string;
  readonly partnerType: ServicePartnerType;
  readonly description: string;
  readonly contact: ServicePartnerContact;
  readonly registeredAddress: ServicePartnerAddress;
  readonly capabilities: readonly ServicePartnerCapability[];
  readonly coverageStates: readonly string[];
  readonly documentPaths: readonly string[];
  readonly status:
    | "draft"
    | "submitted"
    | "underReview"
    | "additionalInformationRequired"
    | "approved"
    | "rejected"
    | "withdrawn";
  readonly reviewerId?: string;
  readonly reviewerNote?: string;
  readonly submittedAt?: string;
  readonly reviewedAt?: string;
}

export interface ServicePartnerAssignment extends BaseEntity {
  readonly assignmentNumber: string;
  readonly partnerId: string;
  readonly partnerName: string;
  readonly sourceType:
    | "warrantyClaim"
    | "returnInspection"
    | "disputeInspection"
    | "repairRequest"
    | "qualityAudit";
  readonly sourceId: string;
  readonly customerId: string;
  readonly studioId: string;
  readonly capability: ServicePartnerCapability;
  readonly status:
    | "assigned"
    | "accepted"
    | "declined"
    | "scheduled"
    | "inProgress"
    | "completed"
    | "cancelled";
  readonly priority:
    | "low"
    | "normal"
    | "high"
    | "urgent";
  readonly title: string;
  readonly description: string;
  readonly scheduledAt?: string;
  readonly acceptedAt?: string;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly responseDueAt: string;
  readonly completionDueAt?: string;
  readonly estimatedCostPaise: number;
  readonly approvedCostPaise: number;
  readonly customerPayablePaise: number;
  readonly platformPayablePaise: number;
  readonly completionNote?: string;
}

export interface ServicePartnerAnalytics {
  readonly totalPartners: number;
  readonly activePartners: number;
  readonly pendingVerification: number;
  readonly suspendedPartners: number;
  readonly acceptingAssignments: number;
  readonly activeAssignments: number;
  readonly completedAssignments: number;
  readonly averageCompletionHours: number;
  readonly averageQualityScore: number;
  readonly averageCustomerRating: number;
  readonly grossServiceValuePaise: number;
  readonly partnerPayableValuePaise: number;
  readonly platformRevenuePaise: number;
}
