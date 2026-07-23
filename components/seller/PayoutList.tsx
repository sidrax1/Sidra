import type { ReactNode } from "react";

import { PayoutCard } from "@/components/seller/PayoutCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Payout } from "@/types/payout";

interface PayoutListProps {
  readonly payouts: readonly Payout[];
  readonly emptyAction?: ReactNode;
}

export function PayoutList({
  emptyAction,
  payouts,
}: PayoutListProps): React.JSX.Element {
  if (payouts.length === 0) {
    return (
      <EmptyState
       title="No payouts yet"
       description="Eligible completed orders will be grouped into future payout cycles."
       action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-4">
    {payouts.map((payout) => (

      <PayoutCard
        key={payout.id}
        payout={payout}
      />
    ))}
   </div>
 );
}
