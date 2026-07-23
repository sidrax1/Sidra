import type {
  ReactNode,
} from "react";

import { DisputeCard } from "@/components/disputes/DisputeCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type {
  Dispute,
} from "@/types/dispute";

interface DisputeListProps {
  readonly disputes: readonly Dispute[];
  readonly emptyAction?: ReactNode;
  readonly loadingDisputeIds?: ReadonlySet<string>;
  readonly onOpen: (
    dispute: Dispute
  ) => void;
  readonly onAssign?: (
    dispute: Dispute
  ) => void;
  readonly onEscalate?: (
    dispute: Dispute
  ) => void;
  readonly onResolve?: (
    dispute: Dispute
  ) => void;
}

export function DisputeList({
  disputes,
  emptyAction,
  loadingDisputeIds,
  onAssign,
  onEscalate,
  onOpen,
  onResolve,
}: DisputeListProps): React.JSX.Element {
  if (disputes.length === 0) {
    return (
      <EmptyState
        title="No disputes found"
        description="Customer, Studio and payment disputes will appear here."
        action={emptyAction}
      />
    );
  }

  const priorityWeight: Record<
    Dispute["priority"],
    number
  > = {
    urgent: 4,
    high: 3,
    normal: 2,
    low: 1,
  };

  const orderedDisputes = [
    ...disputes,
  ].sort((first, second) => {
    const priorityDifference =
      priorityWeight[second.priority] -
      priorityWeight[first.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    if (first.riskScore !== second.riskScore) {
      return second.riskScore - first.riskScore;
    }

    return first.responseDueAt.localeCompare(
      second.responseDueAt
    );
  });

  return (
    <section
      aria-label="Disputes"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedDisputes.map((dispute) => (
        <DisputeCard
          key={dispute.id}
          dispute={dispute}
          loading={
            loadingDisputeIds?.has(dispute.id) ??
            false
          }
          onOpen={onOpen}
          onAssign={onAssign}
          onEscalate={onEscalate}
          onResolve={onResolve}
        />
      ))}
    </section>
  );
}
