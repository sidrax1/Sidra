import type {
  BaseEntity,
} from "@/types/common";

export type ReviewStatus =
  | "pending"
  | "published"
  | "rejected"
  | "hidden";

export interface ProductReview
  extends BaseEntity {
  readonly productId: string;
  readonly orderId: string;
  readonly customerId: string;
  readonly studioId: string;
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly title: string;
  readonly review: string;
  readonly images: readonly string[];
  readonly videoURL?: string;
  readonly verifiedPurchase: boolean;
  readonly helpfulCount: number;
  readonly reportCount: number;
  readonly status: ReviewStatus;
  readonly moderationReason?: string;
  readonly publishedAt?: string;
}

export interface ReviewHelpfulVote
  extends BaseEntity {
  readonly reviewId: string;
  readonly userId: string;
}

export interface ReviewReport
  extends BaseEntity {
  readonly reviewId: string;
  readonly reporterId: string;
  readonly reason:
    | "spam"
    | "abusive"
    | "irrelevant"
    | "personalInformation"
    | "fraudulent"
    | "other";
  readonly explanation?: string;
  readonly status:
    | "open"
    | "reviewed"
    | "dismissed"
    | "actioned";
}
