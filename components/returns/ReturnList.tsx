import type {
  ReactNode,
} from "react";

import {
  ReturnCard,
} from "@/components/returns/ReturnCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  ReturnRequest,
} from "@/types/return";

interface ReturnListProps {
  readonly returns: readonly ReturnRequest[];
  readonly emptyAction?: ReactNode;
  readonly loadingReturnIds?: ReadonlySet<string>;
  readonly onOpen: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onReview?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onSchedulePickup?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onInspect?: (
    returnRequest: ReturnRequest
  ) => void;
  readonly onCancel?: (
    returnRequest: ReturnRequest
  ) => void;
}

export function ReturnList({
  emptyAction,
  loadingReturnIds,
  onCancel,
  onInspect,
  onOpen,
  onReview,
  onSchedulePickup,
  returns,
}: ReturnListProps): React.JSX.Element {
  if (
    returns.length === 0
  ) {
    return (
      <EmptyState
        title="No returns found"
        description="Customer return requests, pickups and inspections will appear here."
        action={emptyAction}
      />
    );
  }

  const priorityWeight: Record<
    ReturnRequest["priority"],
    number
  > = {
    urgent: 4,
    high: 3,
    normal: 2,
    low: 1,
  };

  const statusWeight: Record<
    ReturnRequest["status"],
    number
  > = {
    requested: 14,
    underReview: 13,
    approved: 12,
    pickupScheduled: 11,
    inTransit: 10,
    received: 9,
    inspectionInProgress: 8,
    inspectionFailed: 7,
    inspectionPassed: 6,
    refundInitiated: 5,
    replacementInitiated: 4,
    rejected: 3,
    completed: 2,
    cancelled: 1,
  };

  const orderedReturns =
    [...returns].sort(
      (
        firstReturn,
        secondReturn
      ) => {
        const priorityDifference =
          priorityWeight[
            secondReturn
              .priority
          ] -
          priorityWeight[
            firstReturn
              .priority
          ];

        if (
          priorityDifference !==
          0
        ) {
          return priorityDifference;
        }

        const statusDifference =
          statusWeight[
            secondReturn.status
          ] -
          statusWeight[
            firstReturn.status
          ];

        if (
          statusDifference !==
          0
        ) {
          return statusDifference;
        }

        return firstReturn.responseDueAt.localeCompare(
          secondReturn.responseDueAt
        );
      }
    );

  return (
    <section
      aria-label="Returns"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedReturns.map(
        (returnRequest) => (
          <ReturnCard
            key={
              returnRequest.id
            }
            returnRequest={
              returnRequest
            }
            loading={
              loadingReturnIds?.has(
                returnRequest.id
              ) ?? false
            }
            onOpen={onOpen}
            onReview={
              onReview
            }
            onSchedulePickup={
              onSchedulePickup
            }
            onInspect={
              onInspect
            }
            onCancel={
              onCancel
            }
          />
        )
      )}
    </section>
  );
}
