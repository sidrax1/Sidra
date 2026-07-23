import type {
  ReactNode,
} from "react";

import {
  ServicePartnerCard,
} from "@/components/service-partners/ServicePartnerCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerListProps {
  readonly partners: readonly ServicePartner[];
  readonly emptyAction?: ReactNode;
  readonly loadingPartnerIds?: ReadonlySet<string>;
  readonly onOpen: (
    partner: ServicePartner
  ) => void;
  readonly onAssign?: (
    partner: ServicePartner
  ) => void;
  readonly onChangeStatus?: (
    partner: ServicePartner
  ) => void;
  readonly onChangeAvailability?: (
    partner: ServicePartner
  ) => void;
}

export function ServicePartnerList({
  emptyAction,
  loadingPartnerIds,
  onAssign,
  onChangeAvailability,
  onChangeStatus,
  onOpen,
  partners,
}: ServicePartnerListProps): React.JSX.Element {
  if (partners.length === 0) {
    return (
      <EmptyState
        title="No service partners found"
        description="Verified repair, logistics, inspection and restoration partners will appear here."
        action={emptyAction}
      />
    );
  }

  const statusWeight: Record<
    ServicePartner["status"],
    number
  > = {
    active: 6,
    pendingVerification: 5,
    temporarilyUnavailable: 4,
    suspended: 3,
    rejected: 2,
    archived: 1,
  };

  const orderedPartners =
    [...partners].sort(
      (
        firstPartner,
        secondPartner
      ) => {
        const availabilityDifference =
          Number(
            secondPartner.acceptingAssignments
          ) -
          Number(
            firstPartner.acceptingAssignments
          );

        if (
          availabilityDifference !==
          0
        ) {
          return availabilityDifference;
        }

        const statusDifference =
          statusWeight[
            secondPartner.status
          ] -
          statusWeight[
            firstPartner.status
          ];

        if (
          statusDifference !== 0
        ) {
          return statusDifference;
        }

        const qualityDifference =
          secondPartner.performance
            .qualityScore -
          firstPartner.performance
            .qualityScore;

        if (
          qualityDifference !== 0
        ) {
          return qualityDifference;
        }

        return (
          secondPartner.performance
            .customerRating -
          firstPartner.performance
            .customerRating
        );
      }
    );

  return (
    <section
      aria-label="Service partners"
      className="grid gap-5 xl:grid-cols-2"
    >
      {orderedPartners.map(
        (partner) => (
          <ServicePartnerCard
            key={partner.id}
            partner={partner}
            loading={
              loadingPartnerIds?.has(
                partner.id
              ) ?? false
            }
            onOpen={onOpen}
            onAssign={onAssign}
            onChangeStatus={
              onChangeStatus
            }
            onChangeAvailability={
              onChangeAvailability
            }
          />
        )
      )}
    </section>
  );
}
