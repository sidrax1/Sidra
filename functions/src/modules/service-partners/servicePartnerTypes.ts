import type {
  Timestamp,
} from "firebase-admin/firestore";

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

export type ServicePartnerApplicationStatus =
  | "draft"
  | "submitted"
  | "underReview"
  | "additionalInformationRequired"
  | "approved"
  | "rejected"
  | "withdrawn";

export type ServicePartnerAssignmentStatus =
  | "assigned"
  | "accepted"
  | "declined"
  | "scheduled"
  | "inProgress"
  | "completed"
  | "cancelled";

export type ServicePartnerAssignmentSourceType =
  | "warrantyClaim"
  | "returnInspection"
  | "disputeInspection"
  | "repairRequest"
  | "qualityAudit";

export type ServicePartnerAssignmentPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

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
}

export interface ServicePartnerContact {
  readonly contactName: string;
  readonly designation?: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly alternatePhoneNumber?: string;
  readonly websiteURL?: string;
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

export interface ServicePartnerVerification {
  readonly status:
    | "notStarted"
    | "documentsPending"
    | "underReview"
    | "siteInspectionPending"
    | "verified"
    | "failed"
    | "expired";
  readonly submittedAt?: Timestamp;
  readonly reviewedAt?: Timestamp;
  readonly reviewedBy?: string;
  readonly siteInspectionAt?: Timestamp;
  readonly siteInspectionBy?: string;
  readonly failureReason?: string;
  readonly expiresAt?: Timestamp;
  readonly riskScore: number;
}

export interface ServicePartnerApplicationDocument {
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
  readonly status: ServicePartnerApplicationStatus;
  readonly reviewerId?: string;
  readonly reviewerNote?: string;
  readonly submittedAt?: Timestamp;
  readonly reviewedAt?: Timestamp;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface ServicePartnerDocument {
  readonly partnerNumber: string;
  readonly legalName: string;
  readonly displayName: string;
  readonly slug: string;
  readonly description: string;
  readonly partnerType: ServicePartnerType;
  readonly status: ServicePartnerStatus;
  readonly contact: ServicePartnerContact;
  readonly registeredAddress: ServicePartnerAddress;
  readonly capabilityKeys: readonly ServicePartnerCapability[];
  readonly coverageStateKeys: readonly string[];
  readonly coverageCityKeys: readonly string[];
  readonly acceptingAssignments: boolean;
  readonly maximumConcurrentAssignments: number;
  readonly currentAssignmentCount: number;
  readonly performance: ServicePartnerPerformance;
  readonly verification: ServicePartnerVerification;
  readonly applicationId: string;
  readonly applicantUserId: string;
  readonly activatedAt?: Timestamp;
  readonly suspendedAt?: Timestamp;
  readonly suspensionReason?: string;
  readonly archivedAt?: Timestamp;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface ServicePartnerAssignmentDocument {
  readonly assignmentNumber: string;
  readonly partnerId: string;
  readonly partnerName: string;
  readonly sourceType: ServicePartnerAssignmentSourceType;
  readonly sourceId: string;
  readonly customerId: string;
  readonly studioId: string;
  readonly capability: ServicePartnerCapability;
  readonly status: ServicePartnerAssignmentStatus;
  readonly priority: ServicePartnerAssignmentPriority;
  readonly title: string;
  readonly description: string;
  readonly responseDueAt: Timestamp;
  readonly completionDueAt?: Timestamp;
  readonly scheduledAt?: Timestamp;
  readonly acceptedAt?: Timestamp;
  readonly startedAt?: Timestamp;
  readonly completedAt?: Timestamp;
  readonly declinedAt?: Timestamp;
  readonly cancelledAt?: Timestamp;
  readonly estimatedCostPaise: number;
  readonly approvedCostPaise: number;
  readonly customerPayablePaise: number;
  readonly platformPayablePaise: number;
  readonly completionNote?: string;
  readonly lastStatusNote?: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export interface CreateServicePartnerApplicationInput {
  readonly legalName: string;
  readonly displayName: string;
  readonly partnerType: ServicePartnerType;
  readonly description: string;
  readonly contact: ServicePartnerContact;
  readonly registeredAddress: ServicePartnerAddress;
  readonly capabilities: readonly ServicePartnerCapability[];
  readonly coverageStates: readonly string[];
  readonly documentPaths: readonly string[];
}

export interface ReviewServicePartnerApplicationInput {
  readonly applicationId: string;
  readonly decision:
    | "approve"
    | "requestInformation"
    | "reject";
  readonly reviewerNote: string;
  readonly riskScore: number;
}

export interface UpdateServicePartnerStatusInput {
  readonly partnerId: string;
  readonly status: ServicePartnerStatus;
  readonly reason: string;
}

export interface UpdateServicePartnerAvailabilityInput {
  readonly partnerId: string;
  readonly acceptingAssignments: boolean;
  readonly maximumConcurrentAssignments: number;
  readonly reason?: string;
}

export interface AssignServicePartnerInput {
  readonly partnerId: string;
  readonly sourceType: ServicePartnerAssignmentSourceType;
  readonly sourceId: string;
  readonly customerId: string;
  readonly studioId: string;
  readonly capability: ServicePartnerCapability;
  readonly priority: ServicePartnerAssignmentPriority;
  readonly title: string;
  readonly description: string;
  readonly responseDueAt: string;
  readonly completionDueAt?: string;
  readonly estimatedCostPaise: number;
  readonly approvedCostPaise: number;
  readonly customerPayablePaise: number;
  readonly platformPayablePaise: number;
}

export interface UpdateServiceAssignmentStatusInput {
  readonly assignmentId: string;
  readonly status:
    | "accepted"
    | "declined"
    | "scheduled"
    | "inProgress"
    | "completed"
    | "cancelled";
  readonly note: string;
  readonly scheduledAt?: string;
  readonly completionNote?: string;
}
