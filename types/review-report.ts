import type { BaseEntity } from "@/types/common";

export type ReviewReportReason =
  | "spam"
  | "harassment"
  | "hateSpeech"
  | "personalInformation"
  | "falseInformation"
  | "irrelevantContent"
  | "commercialPromotion"
  | "conflictOfInterest"
  | "prohibitedContent"
  | "other";

export type ReviewReportStatus =
  | "submitted"
  | "underReview"
  | "actionRequired"
  | "resolved"
  | "dismissed"
  | "escalated";

export type ReviewReportResolution =
  | "reviewPublished"
  | "reviewHidden"
  | "reviewRejected"
  | "reviewDeleted"
  | "reportDismissed"
  | "accountRestricted"
  | "escalatedToCompliance";

export interface ReviewReportEvidence {
  readonly id: string;
  readonly storagePath: string;
  readonly downloadURL: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export interface ReviewReportReporterSnapshot {
  readonly reporterId: string;
  readonly reporterName: string;
  readonly reporterEmail?: string;
  readonly reporterRole:
    | "customer"
    | "seller"
    | "admin"
    | "support";
}

export interface ReviewReportReviewSnapshot {
  readonly reviewId: string;
  readonly productId: string;
  readonly studioId: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly title: string;
  readonly comment: string;
  readonly rating: number;
  readonly verifiedPurchase: boolean;
  readonly createdAt: string;
}

export interface ReviewReportAssignment {
  readonly assignedTo: string;
  readonly assignedBy: string;
  readonly assignedAt: string;
}

export interface ReviewReportDecision {
  readonly resolution: ReviewReportResolution;
  readonly reason: string;
  readonly internalNote?: string;
  readonly decidedBy: string;
  readonly decidedAt: string;
  readonly notifyReporter: boolean;
  readonly notifyReviewAuthor: boolean;
  readonly notifyStudio: boolean;
}

export interface ReviewReport extends BaseEntity {
  readonly reportNumber: string;
  readonly reason: ReviewReportReason;
  readonly description: string;
  readonly status: ReviewReportStatus;
  readonly reporter: ReviewReportReporterSnapshot;
  readonly review: ReviewReportReviewSnapshot;
  readonly evidence: readonly ReviewReportEvidence[];
  readonly assignment?: ReviewReportAssignment;
  readonly decision?: ReviewReportDecision;
  readonly duplicateOfReportId?: string;
  readonly reportCountAtSubmission: number;
  readonly riskScore: number;
  readonly escalatedAt?: string;
  readonly resolvedAt?: string;
}

export interface ReviewReportTimelineEvent extends BaseEntity {
  readonly reportId: string;
  readonly status: ReviewReportStatus;
  readonly title: string;
  readonly description?: string;
  readonly actorId: string;
  readonly actorRole: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface ReviewReportAnalytics {
  readonly totalReports: number;
  readonly openReports: number;
  readonly escalatedReports: number;
  readonly resolvedReports: number;
  readonly dismissedReports: number;
  readonly averageResolutionHours: number;
  readonly hiddenReviewCount: number;
  readonly deletedReviewCount: number;
}
