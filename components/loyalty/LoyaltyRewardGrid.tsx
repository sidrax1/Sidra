import type {
  ReactNode,
} from "react";

import {
  LoyaltyRewardCard,
} from "@/components/loyalty/LoyaltyRewardCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  LoyaltyAccount,
  LoyaltyReward,
} from "@/types/loyalty";

interface LoyaltyRewardGridProps {
  readonly rewards: readonly LoyaltyReward[];
  readonly account?: LoyaltyAccount;
  readonly loadingRewardIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onRedeem?: (
    reward: LoyaltyReward
  ) => void | Promise<void>;
}

export function LoyaltyRewardGrid({
  account,
  emptyAction,
  loadingRewardIds,
  onRedeem,
  rewards,
}: LoyaltyRewardGridProps): React.JSX.Element {
  if (
    rewards.length === 0
  ) {
    return (
      <EmptyState
        title="No loyalty rewards available"
        description="Active rewards matching your membership tier will appear here."
        action={emptyAction}
      />
    );
  }

  const orderedRewards =
    [...rewards].sort(
      (
        firstReward,
        secondReward
      ) => {
        if (
          firstReward.featured !==
          secondReward.featured
        ) {
          return firstReward.featured
            ? -1
            : 1;
        }

        if (
          firstReward.sortOrder !==
          secondReward.sortOrder
        ) {
          return (
            firstReward.sortOrder -
            secondReward.sortOrder
          );
        }

        return (
          firstReward.pointsCost -
          secondReward.pointsCost
        );
      }
    );

  return (
    <section
      aria-label="Loyalty rewards"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {orderedRewards.map(
        (reward) => (
          <LoyaltyRewardCard
            key={reward.id}
            reward={reward}
            account={account}
            loading={
              loadingRewardIds?.has(
                reward.id
              ) ?? false
            }
            onRedeem={
              onRedeem
            }
          />
        )
      )}
    </section>
  );
}
