import {
  EmptyState,
} from "@/components/ui/EmptyState";
import {
  ServicePartnerCoverageCard,
} from "@/components/service-partners/ServicePartnerCoverageCard";
import type {
  ServicePartnerCoverageArea,
} from "@/types/service-partner";

interface ServicePartnerCoverageGridProps {
  readonly areas: readonly ServicePartnerCoverageArea[];
}

export function ServicePartnerCoverageGrid({
  areas,
}: ServicePartnerCoverageGridProps): React.JSX.Element {
  if (areas.length === 0) {
    return (
      <EmptyState
        title="No coverage areas configured"
        description="Verified city, postal-code and service-radius coverage will appear here."
      />
    );
  }

  const orderedAreas = [
    ...areas,
  ].sort((first, second) =>
    first.state.localeCompare(
      second.state
    )
  );

  return (
    <section
      aria-label="Service coverage areas"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {orderedAreas.map((area) => (
        <ServicePartnerCoverageCard
          key={area.id}
          area={area}
        />
      ))}
    </section>
  );
}
