import type { BaseEntity } from "@/types/common";

export type LoyaltyAccountStatus =
  | "active"
  | "restricted"
  | "suspended"
  | "closed";

export type LoyaltyTier =
  | "atelier"
  | "signature"
  | "prestige"
  | "maison";

export type LoyaltyTransactionType =
  | "orderEarned"
  | "reviewEarned"
  | "referralEarned"
  | "campaignBonus"
  | "manualCredit"
  | "rewardRedeemed"
  | "orderReversal"
  | "refundReversal"
  | "pointsExpired"
  | "manualDebit";

export type LoyaltyRewardType =
  | "fixedDiscount"
  | "percentageDiscount"
  | "freeShipping"
  | "giftCard"
  | "exclusiveAccess"
  | "complimentaryGift";

export type LoyaltyRewardStatus =
  | "draft"
  | "active"
  | "paused"
  | "expired"
  | "archived";

export type LoyaltyRedemptionStatus =
  | "pending"
  | "issued"
  | "applied"
  | "used"
  | "expired"
  | "cancelled"
  | "reversed";

export interface LoyaltyTierBenefit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly iconName?: string;
}

export interface LoyaltyTierConfiguration extends BaseEntity {
  readonly tier: LoyaltyTier;
  readonly displayName: string;
  readonly description: string;
  readonly minimumLifetimePoints: number;
  readonly earningMultiplierBasisPoints: number;
  readonly benefits: readonly LoyaltyTierBenefit[];
  readonly active: boolean;
  readonly sortOrder: number;
}

export interface LoyaltyAccount extends BaseEntity {
  readonly customerId: string;
  readonly status: LoyaltyAccountStatus;
  readonly tier: LoyaltyTier;
  readonly availablePoints: number;
  readonly pendingPoints: number;
  readonly lifetimeEarnedPoints: number;
  readonly lifetimeRedeemedPoints: number;
  readonly lifetimeExpiredPoints: number;
  readonly nextExpirationAt?: string;
  readonly nextExpirationPoints: number;
  readonly lastEarnedAt?: string;
  readonly lastRedeemedAt?: string;
  readonly tierUpdatedAt?: string;
}

export interface LoyaltyTransactionMetadata {
  readonly orderId?: string;
  readonly orderNumber?: string;
  readonly productId?: string;
  readonly studioId?: string;
  readonly reviewId?: string;
  readonly referralId?: string;
  readonly rewardId?: string;
  readonly redemptionId?: string;
  readonly campaignId?: string;
  readonly adjustmentReference?: string;
}

export interface LoyaltyTransaction extends BaseEntity {
  readonly loyaltyAccountId: string;
  readonly customerId: string;
  readonly type: LoyaltyTransactionType;
  readonly points: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly description: string;
  readonly metadata: LoyaltyTransactionMetadata;
  readonly availableAt?: string;
  readonly expiresAt?: string;
  readonly reversedTransactionId?: string;
  readonly createdBy: string;
}

export interface LoyaltyRewardValue {
  readonly discountPaise?: number;
  readonly percentageBasisPoints?: number;
  readonly maximumDiscountPaise?: number;
  readonly giftCardValuePaise?: number;
  readonly freeShippingMaximumPaise?: number;
  readonly complimentaryProductId?: string;
}

export interface LoyaltyRewardEligibility {
  readonly minimumTier?: LoyaltyTier;
  readonly minimumOrderPaise?: number;
  readonly eligibleStudioIds: readonly string[];
  readonly eligibleProductIds: readonly string[];
  readonly eligibleCategoryIds: readonly string[];
  readonly firstRedemptionOnly: boolean;
}

export interface LoyaltyReward extends BaseEntity {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly imageURL?: string;
  readonly type: LoyaltyRewardType;
  readonly status: LoyaltyRewardStatus;
  readonly pointsCost: number;
  readonly value: LoyaltyRewardValue;
  readonly eligibility: LoyaltyRewardEligibility;
  readonly totalRedemptionLimit?: number;
  readonly redemptionLimitPerCustomer?: number;
  readonly redemptionCount: number;
  readonly validityDaysAfterIssue: number;
  readonly startsAt: string;
  readonly endsAt?: string;
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly createdBy: string;
  readonly updatedBy: string;
}

export interface LoyaltyRedemption extends BaseEntity {
  readonly redemptionNumber: string;
  readonly loyaltyAccountId: string;
  readonly customerId: string;
  readonly rewardId: string;
  readonly rewardName: string;
  readonly rewardType: LoyaltyRewardType;
  readonly status: LoyaltyRedemptionStatus;
  readonly pointsSpent: number;
  readonly issuedCode?: string;
  readonly issuedCodeHash?: string;
  readonly appliedOrderId?: string;
  readonly issuedAt?: string;
  readonly appliedAt?: string;
  readonly usedAt?: string;
  readonly expiresAt: string;
  readonly cancelledAt?: string;
  readonly cancellationReason?: string;
}

export interface LoyaltySummary {
  readonly account: LoyaltyAccount;
  readonly currentTier: LoyaltyTierConfiguration;
  readonly nextTier?: LoyaltyTierConfiguration;
  readonly pointsToNextTier: number;
  readonly tierProgressPercentage: number;
  readonly recentTransactions: readonly LoyaltyTransaction[];
  readonly recommendedRewards: readonly LoyaltyReward[];
}

export interface LoyaltyProgramAnalytics {
  readonly activeMembers: number;
  readonly pointsIssued: number;
  readonly pointsRedeemed: number;
  readonly pointsExpired: number;
  readonly outstandingPoints: number;
  readonly redemptionRatePercentage: number;
  readonly attributedRevenuePaise: number;
}
