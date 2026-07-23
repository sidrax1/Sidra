import type { BaseEntity } from "@/types/common";

export type SellerApplicationStatus =
 | "pending"
 | "underReview"
 | "moreInfoRequested"
 | "held"
 | "approved"
 | "rejected";

export interface SellerApplication extends BaseEntity {
  readonly applicantId: string;
  readonly fullName: string;
  readonly studioName: string;
  readonly email: string;
  readonly mobile: string;
  readonly city: string;
  readonly state: string;
  readonly instagramURL?: string;
  readonly experience: string;
  readonly categoryIds: readonly string[];
  readonly reasonToJoin: string;
  readonly expectedMonthlyCapacity: number;
  readonly portfolioStoragePaths: readonly string[];
  readonly status: SellerApplicationStatus;
  readonly reviewNotes?: string;
  readonly reviewedBy?: string;
  readonly reviewedAt?: string;
  readonly approvedStudioId?: string;
}
