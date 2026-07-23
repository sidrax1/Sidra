import type {
  ReactNode,
} from "react";

import { LoyaltyRedemptionCard } from "@/components/loyalty/LoyaltyRedemptionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  LoyaltyRedemption,
} from "@/types/loyalty";

interface LoyaltyRedemptionListProps {
  readonly redemptions: readonly LoyaltyRedemption[];
  readonly emptyAction?: ReactNode;
  readonly loadingRedemptionIds?: ReadonlySet<string>;
  readonly onCancel?: (
    redemption: LoyaltyRedemption
  ) => void;
  readonly onViewOrder?: (
    orderId: string
  ) => void;
}

export function LoyaltyRedemptionList({
  emptyAction,
  loadingRedemptionIds,
  onCancel,
  onViewOrder,
  redemptions,
}: LoyaltyRedemptionListProps): React.JSX.Element {
  if (redemptions.length === 0) {
    return (
      <EmptyState
        title="No reward redemptions"
        description="Redeemed loyalty benefits and issued reward codes will appear here."
        action={emptyAction}
      />
    );
  }

  const orderedRedemptions = [
    ...redemptions,
  ].sort((first, second) =>
    second.createdAt.localeCompare(
      first.createdAt
    )
  );

  return (
    <section
      aria-label="Loyalty redemptions"
      className="grid gap-5 lg:grid-cols-2"
    >
      {orderedRedemptions.map(
        (redemption) => (
          <LoyaltyRedemptionCard
            key={redemption.id}
            redemption={redemption}
            loading={
              loadingRedemptionIds?.has(
                redemption.id
              ) ?? false
            }
            onCancel={onCancel}
            onViewOrder={onViewOrder}
          />
        )
      )}
    </section>
  );
}
