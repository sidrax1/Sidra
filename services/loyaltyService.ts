import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { getFirebaseFirestore } from "@/firebase/firestore";

const db = getFirebaseFirestore();
import {
  callableFunction,
} from "@/firebase/functions";
import type {
  LoyaltyAdjustmentInput,
  LoyaltyRewardInput,
  LoyaltyRewardStatusInput,
  LoyaltyTierConfigurationInput,
  RedeemLoyaltyRewardInput,
} from "@/lib/schemas/loyalty";
import type {
  LoyaltyAccount,
  LoyaltyProgramAnalytics,
  LoyaltyRedemption,
  LoyaltyReward,
  LoyaltyRewardStatus,
  LoyaltySummary,
  LoyaltyTierConfiguration,
  LoyaltyTransaction,
} from "@/types/loyalty";

export interface LoyaltyRewardPage {
  readonly rewards: readonly LoyaltyReward[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

export interface LoyaltyTransactionPage {
  readonly transactions: readonly LoyaltyTransaction[];
  readonly cursor:
    | QueryDocumentSnapshot<DocumentData>
    | null;
  readonly hasMore: boolean;
}

interface LoyaltyRedemptionResponse {
  readonly account: LoyaltyAccount;
  readonly redemption: LoyaltyRedemption;
  readonly transaction: LoyaltyTransaction;
}

interface LoyaltyAdjustmentResponse {
  readonly account: LoyaltyAccount;
  readonly transaction: LoyaltyTransaction;
}

const redeemRewardCallable =
  callableFunction<
    RedeemLoyaltyRewardInput,
    LoyaltyRedemptionResponse
  >("redeemLoyaltyReward");

const adjustPointsCallable =
  callableFunction<
    LoyaltyAdjustmentInput,
    LoyaltyAdjustmentResponse
  >("adjustLoyaltyPoints");

const createRewardCallable =
  callableFunction<
    LoyaltyRewardInput,
    {
      readonly reward: LoyaltyReward;
    }
  >("createLoyaltyReward");

const updateRewardCallable =
  callableFunction<
    LoyaltyRewardInput & {
      readonly rewardId: string;
    },
    {
      readonly reward: LoyaltyReward;
    }
  >("updateLoyaltyReward");

const updateRewardStatusCallable =
  callableFunction<
    LoyaltyRewardStatusInput,
    {
      readonly reward: LoyaltyReward;
    }
  >("updateLoyaltyRewardStatus");

const updateTierCallable =
  callableFunction<
    LoyaltyTierConfigurationInput,
    {
      readonly tier: LoyaltyTierConfiguration;
    }
  >("updateLoyaltyTierConfiguration");

const cancelRedemptionCallable =
  callableFunction<
    {
      readonly redemptionId: string;
      readonly reason: string;
    },
    LoyaltyRedemptionResponse
  >("cancelLoyaltyRedemption");

function assertIdentifier(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(
      `${label} is required.`
    );
  }
}

export async function getLoyaltyAccount(
  customerId: string
): Promise<LoyaltyAccount | null> {
  assertIdentifier(
    customerId,
    "Customer ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "loyaltyAccounts",
        customerId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as LoyaltyAccount;
}

export async function getLoyaltySummary(
  customerId: string
): Promise<LoyaltySummary> {
  assertIdentifier(
    customerId,
    "Customer ID"
  );

  const account =
    await getLoyaltyAccount(
      customerId
    );

  if (!account) {
    throw new Error(
      "Loyalty account was not found."
    );
  }

  const [
    tiersSnapshot,
    transactionsResult,
    rewardsResult,
  ] = await Promise.all([
    getDocs(
      query(
        collection(
          db,
          "loyaltyTiers"
        ),
        where(
          "active",
          "==",
          true
        ),
        orderBy(
          "minimumLifetimePoints",
          "asc"
        )
      )
    ),
    getLoyaltyTransactions({
      customerId,
      pageSize: 8,
    }),
    getLoyaltyRewards({
      status: "active",
      pageSize: 8,
    }),
  ]);

  const tiers =
    tiersSnapshot.docs.map(
      (tierDocument) =>
        ({
          id: tierDocument.id,
          ...tierDocument.data(),
        }) as LoyaltyTierConfiguration
    );

  const currentTier =
    tiers.find(
      (tier) =>
        tier.tier ===
        account.tier
    );

  if (!currentTier) {
    throw new Error(
      "Current loyalty tier configuration is unavailable."
    );
  }

  const currentTierIndex =
    tiers.findIndex(
      (tier) =>
        tier.tier ===
        account.tier
    );

  const nextTier =
    currentTierIndex >= 0
      ? tiers.at(
          currentTierIndex + 1
        )
      : undefined;

  const pointsToNextTier =
    nextTier
      ? Math.max(
          nextTier.minimumLifetimePoints -
            account.lifetimeEarnedPoints,
          0
        )
      : 0;

  const tierRange =
    nextTier
      ? Math.max(
          nextTier.minimumLifetimePoints -
            currentTier.minimumLifetimePoints,
          1
        )
      : 1;

  const progressWithinTier =
    Math.max(
      account.lifetimeEarnedPoints -
        currentTier.minimumLifetimePoints,
      0
    );

  const tierProgressPercentage =
    nextTier
      ? Math.min(
          Math.round(
            (progressWithinTier /
              tierRange) *
              100
          ),
          100
        )
      : 100;

  return {
    account,
    currentTier,
    nextTier,
    pointsToNextTier,
    tierProgressPercentage,
    recentTransactions:
      transactionsResult.transactions,
    recommendedRewards:
      rewardsResult.rewards.filter(
        (reward) =>
          reward.pointsCost <=
            account.availablePoints ||
          reward.featured
      ),
  };
}

export async function getLoyaltyTransactions(
  input: {
    readonly customerId: string;
    readonly pageSize?: number;
    readonly cursor?:
      | QueryDocumentSnapshot<DocumentData>
      | null;
  }
): Promise<LoyaltyTransactionPage> {
  assertIdentifier(
    input.customerId,
    "Customer ID"
  );

  const pageSize = Math.min(
    Math.max(
      input.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [
      where(
        "customerId",
        "==",
        input.customerId
      ),
      orderBy(
        "createdAt",
        "desc"
      ),
    ];

  if (input.cursor) {
    constraints.push(
      startAfter(input.cursor)
    );
  }

  constraints.push(
    limit(pageSize + 1)
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "loyaltyTransactions"
        ),
        ...constraints
      )
    );

  const documents =
    snapshot.docs.slice(
      0,
      pageSize
    );

  return {
    transactions:
      documents.map(
        (transactionDocument) =>
          ({
            id:
              transactionDocument.id,
            ...transactionDocument.data(),
          }) as LoyaltyTransaction
      ),
    cursor:
      documents.at(-1) ??
      null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getLoyaltyRewards(
  input: {
    readonly status?:
      | LoyaltyRewardStatus
      | "all";
    readonly featuredOnly?: boolean;
    readonly pageSize?: number;
    readonly cursor?:
      | QueryDocumentSnapshot<DocumentData>
      | null;
  } = {}
): Promise<LoyaltyRewardPage> {
  const pageSize = Math.min(
    Math.max(
      input.pageSize ?? 20,
      1
    ),
    50
  );

  const constraints: QueryConstraint[] =
    [];

  if (
    input.status &&
    input.status !== "all"
  ) {
    constraints.push(
      where(
        "status",
        "==",
        input.status
      )
    );
  }

  if (input.featuredOnly) {
    constraints.push(
      where(
        "featured",
        "==",
        true
      )
    );
  }

  constraints.push(
    orderBy(
      "sortOrder",
      "asc"
    ),
    orderBy(
      "createdAt",
      "desc"
    )
  );

  if (input.cursor) {
    constraints.push(
      startAfter(input.cursor)
    );
  }

  constraints.push(
    limit(pageSize + 1)
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "loyaltyRewards"
        ),
        ...constraints
      )
    );

  const documents =
    snapshot.docs.slice(
      0,
      pageSize
    );

  return {
    rewards: documents.map(
      (rewardDocument) =>
        ({
          id:
            rewardDocument.id,
          ...rewardDocument.data(),
        }) as LoyaltyReward
    ),
    cursor:
      documents.at(-1) ??
      null,
    hasMore:
      snapshot.docs.length >
      pageSize,
  };
}

export async function getLoyaltyReward(
  rewardId: string
): Promise<LoyaltyReward | null> {
  assertIdentifier(
    rewardId,
    "Reward ID"
  );

  const snapshot =
    await getDoc(
      doc(
        db,
        "loyaltyRewards",
        rewardId
      )
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as LoyaltyReward;
}

export async function getCustomerRedemptions(
  customerId: string
): Promise<
  readonly LoyaltyRedemption[]
> {
  assertIdentifier(
    customerId,
    "Customer ID"
  );

  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "loyaltyRedemptions"
        ),
        where(
          "customerId",
          "==",
          customerId
        ),
        orderBy(
          "createdAt",
          "desc"
        ),
        limit(100)
      )
    );

  return snapshot.docs.map(
    (redemptionDocument) =>
      ({
        id:
          redemptionDocument.id,
        ...redemptionDocument.data(),
      }) as LoyaltyRedemption
  );
}

export async function getLoyaltyTierConfigurations(): Promise<
  readonly LoyaltyTierConfiguration[]
> {
  const snapshot =
    await getDocs(
      query(
        collection(
          db,
          "loyaltyTiers"
        ),
        orderBy(
          "sortOrder",
          "asc"
        )
      )
    );

  return snapshot.docs.map(
    (tierDocument) =>
      ({
        id: tierDocument.id,
        ...tierDocument.data(),
      }) as LoyaltyTierConfiguration
  );
}

export async function redeemLoyaltyReward(
  input: RedeemLoyaltyRewardInput
): Promise<LoyaltyRedemptionResponse> {
  const result =
    await redeemRewardCallable(
      input
    );

  return result.data;
}

export async function adjustLoyaltyPoints(
  input: LoyaltyAdjustmentInput
): Promise<LoyaltyAdjustmentResponse> {
  const result =
    await adjustPointsCallable(
      input
    );

  return result.data;
}

export async function createLoyaltyReward(
  input: LoyaltyRewardInput
): Promise<LoyaltyReward> {
  const result =
    await createRewardCallable(
      input
    );

  return result.data.reward;
}

export async function updateLoyaltyReward(
  rewardId: string,
  input: LoyaltyRewardInput
): Promise<LoyaltyReward> {
  const result =
    await updateRewardCallable({
      rewardId,
      ...input,
    });

  return result.data.reward;
}

export async function updateLoyaltyRewardStatus(
  input: LoyaltyRewardStatusInput
): Promise<LoyaltyReward> {
  const result =
    await updateRewardStatusCallable(
      input
    );

  return result.data.reward;
}

export async function updateLoyaltyTierConfiguration(
  input: LoyaltyTierConfigurationInput
): Promise<LoyaltyTierConfiguration> {
  const result =
    await updateTierCallable(
      input
    );

  return result.data.tier;
}

export async function cancelLoyaltyRedemption(
  redemptionId: string,
  reason: string
): Promise<LoyaltyRedemptionResponse> {
  assertIdentifier(
    redemptionId,
    "Redemption ID"
  );

  if (
    reason.trim().length < 10
  ) {
    throw new Error(
      "A clear cancellation reason is required."
    );
  }

  const result =
    await cancelRedemptionCallable({
      redemptionId,
      reason: reason.trim(),
    });

  return result.data;
}

export async function getLoyaltyProgramAnalytics(): Promise<LoyaltyProgramAnalytics> {
  const callable =
    callableFunction<
      Record<string, never>,
      LoyaltyProgramAnalytics
    >(
      "getLoyaltyProgramAnalytics"
    );

  const result =
    await callable({});

  return result.data;
}
