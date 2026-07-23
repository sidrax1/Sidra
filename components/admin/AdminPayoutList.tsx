import type { ReactNode } from "react";

import { AdminPayoutCard } from "@/components/admin/AdminPayoutCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Payout } from "@/types/payout";

export interface AdminPayoutListItem {
  readonly payout: Payout;
  readonly studioName: string;
}

interface AdminPayoutListProps {
  readonly items: readonly AdminPayoutListItem[];
  readonly loadingPayoutIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (payout: Payout) => void;
  readonly onApprove?: (payout: Payout) => void | Promise<void>;
}

export function AdminPayoutList({
  emptyAction,
  items,
  loadingPayoutIds,
  onApprove,
  onView,
}: AdminPayoutListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No payouts found"
        description="Payout records matching the selected filters will appear here."
        action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-4">
    {items.map(({ payout, studioName }) => (
      <AdminPayoutCard
       key={payout.id}
       payout={payout}
       studioName={studioName}
       loading={loadingPayoutIds?.has(payout.id) ?? false}

        onView={onView}
        onApprove={onApprove}
      />
    ))}
   </div>
 );
}
