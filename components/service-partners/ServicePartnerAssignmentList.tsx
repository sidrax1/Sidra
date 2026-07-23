import type {
  ReactNode,
} from "react";

import {
  ServicePartnerAssignmentCard,
} from "@/components/service-partners/ServicePartnerAssignmentCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentListProps {
  readonly assignments: readonly ServicePartnerAssignment[];
  readonly emptyAction?: ReactNode;
  readonly loadingAssignmentIds?: ReadonlySet<string>;
  readonly onOpen: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onAccept?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onDecline?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onSchedule?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onStart?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onComplete?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onCancel?: (
    assignment: ServicePartnerAssignment
  ) => void;
}

export function ServicePartnerAssignmentList({
  assignments,
  emptyAction,
  loadingAssignmentIds,
  onAccept,
  onCancel,
  onComplete,
  onDecline,
  onOpen,
  onSchedule,
  onStart,
}: ServicePartnerAssignmentListProps): React.JSX.Element {
  if (
    assignments.length === 0
  ) {
    return (
      <EmptyState
        title="No service assignments"
        description="Warranty, return, dispute, repair and quality-audit assignments will appear here."
        action={emptyAction}
      />
    );
  }

  const priorityWeight: Record<
    ServicePartnerAssignment["priority"],
    number
  > = {
    urgent: 4,
    high: 3,
    normal: 2,
    low: 1,
  };

  const statusWeight: Record<
    ServicePartnerAssignment["status"],
    number
  > = {
    assigned: 7,
    accepted: 6,
    scheduled: 5,
    inProgress: 4,
    declined: 3,
    completed: 2,
    cancelled: 1,
  };

  const orderedAssignments =
    [...assignments].sort(
      (
        firstAssignment,
        secondAssignment
      ) => {
        const priorityDifference =
          priorityWeight[
            secondAssignment
              .priority
          ] -
          priorityWeight[
            firstAssignment
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
            secondAssignment
              .status
          ] -
          statusWeight[
            firstAssignment
              .status
          ];

        if (
          statusDifference !==
          0
        ) {
          return statusDifference;
        }

        return firstAssignment.responseDueAt.localeCompare(
          secondAssignment.responseDueAt
        );
      }
    );

  return (
    <section
      aria-label="Service partner assignments"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedAssignments.map(
        (assignment) => (
          <ServicePartnerAssignmentCard
            key={assignment.id}
            assignment={
              assignment
            }
            loading={
              loadingAssignmentIds?.has(
                assignment.id
              ) ?? false
            }
            onOpen={onOpen}
            onAccept={onAccept}
            onDecline={onDecline}
            onSchedule={
              onSchedule
            }
            onStart={onStart}
            onComplete={
              onComplete
            }
            onCancel={onCancel}
          />
        )
      )}
    </section>
  );
}
