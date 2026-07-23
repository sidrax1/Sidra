import type {
  ReactNode,
} from "react";

import {
  ServicePartnerApplicationCard,
} from "@/components/service-partners/ServicePartnerApplicationCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationListProps {
  readonly applications: readonly ServicePartnerApplication[];
  readonly emptyAction?: ReactNode;
  readonly loadingApplicationIds?: ReadonlySet<string>;
  readonly onOpen: (
    application: ServicePartnerApplication
  ) => void;
  readonly onApprove?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onRequestInformation?: (
    application: ServicePartnerApplication
  ) => void;
  readonly onReject?: (
    application: ServicePartnerApplication
  ) => void;
}

export function ServicePartnerApplicationList({
  applications,
  emptyAction,
  loadingApplicationIds,
  onApprove,
  onOpen,
  onReject,
  onRequestInformation,
}: ServicePartnerApplicationListProps): React.JSX.Element {
  if (applications.length === 0) {
    return (
      <EmptyState
        title="No service partner applications"
        description="New repair, logistics, inspection and restoration partner applications will appear here."
        action={emptyAction}
      />
    );
  }

  const statusWeight: Record<
    ServicePartnerApplication["status"],
    number
  > = {
    submitted: 7,
    underReview: 6,
    additionalInformationRequired: 5,
    draft: 4,
    approved: 3,
    rejected: 2,
    withdrawn: 1,
  };

  const orderedApplications = [
    ...applications,
  ].sort(
    (
      firstApplication,
      secondApplication
    ) => {
      const statusDifference =
        statusWeight[
          secondApplication.status
        ] -
        statusWeight[
          firstApplication.status
        ];

      if (statusDifference !== 0) {
        return statusDifference;
      }

      const firstDate =
        firstApplication.submittedAt ??
        firstApplication.createdAt;

      const secondDate =
        secondApplication.submittedAt ??
        secondApplication.createdAt;

      return secondDate.localeCompare(
        firstDate
      );
    }
  );

  return (
    <section
      aria-label="Service partner applications"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedApplications.map(
        (application) => (
          <ServicePartnerApplicationCard
            key={application.id}
            application={
              application
            }
            loading={
              loadingApplicationIds?.has(
                application.id
              ) ?? false
            }
            onOpen={onOpen}
            onApprove={
              onApprove
            }
            onRequestInformation={
              onRequestInformation
            }
            onReject={onReject}
          />
        )
      )}
    </section>
  );
}
