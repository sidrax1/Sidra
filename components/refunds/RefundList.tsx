import type {
  ReactNode,
} from "react";

import { RefundCard } from "@/components/refunds/RefundCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  Refund,
} from "@/types/refund";

interface RefundListProps {
  readonly refunds: readonly Refund[];
  readonly emptyAction?: ReactNode;
  readonly loadingRefundIds?: ReadonlySet<string>;
  readonly onOpen: (
    refund: Refund
  ) => void;
  readonly onApprove?: (
    refund: Refund
  ) => void;
  readonly onReject?: (
    refund: Refund
  ) => void;
  readonly onProcess?: (
    refund: Refund
  ) => void;
  readonly onCancel?: (
    refund: Refund
  ) => void;
}

export function RefundList({
  emptyAction,
  loadingRefundIds,
  onApprove,
  onCancel,
  onOpen,
  onProcess,
  onReject,
  refunds,
}: RefundListProps): React.JSX.Element {
  if (refunds.length === 0) {
    return (
      <EmptyState
        title="No refunds found"
        description="Requested, approved, processing and completed refunds will appear here."
        action={emptyAction}
      />
    );
  }

  const statusWeight: Record<
    Refund["status"],
    number
  > = {
    pending: 6,
    approved: 5,
    processing: 4,
    failed: 3,
    completed: 2,
    cancelled: 1,
  };

  const orderedRefunds = [
    ...refunds,
  ].sort((first, second) => {
    const statusDifference =
      statusWeight[second.status] -
      statusWeight[first.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return second.createdAt.localeCompare(
      first.createdAt
    );
  });

  return (
    <section
      aria-label="Refunds"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedRefunds.map((refund) => (
        <RefundCard
          key={refund.id}
          refund={refund}
          loading={
            loadingRefundIds?.has(
              refund.id
            ) ?? false
          }
          onOpen={onOpen}
          onApprove={onApprove}
          onReject={onReject}
          onProcess={onProcess}
          onCancel={onCancel}
        />
      ))}
    </section>
  );
}
