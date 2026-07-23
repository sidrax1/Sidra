import {
  MapPin,
  Navigation,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerCoverageArea,
} from "@/types/service-partner";

interface ServicePartnerServiceAreaSummaryProps {
  readonly areas: readonly ServicePartnerCoverageArea[];
  readonly className?: string;
}

export function ServicePartnerServiceAreaSummary({
  areas,
  className,
}: ServicePartnerServiceAreaSummaryProps): React.JSX.Element {
  const states = [
    ...new Set(
      areas.map(
        (area) => area.state
      )
    ),
  ];

  const cities = [
    ...new Set(
      areas.flatMap(
        (area) => area.cities
      )
    ),
  ];

  const pickupAreas =
    areas.filter(
      (area) =>
        area.pickupAvailable
    ).length;

  const onSiteAreas =
    areas.filter(
      (area) =>
        area.onSiteServiceAvailable
    ).length;

  const maximumRadius =
    areas.reduce(
      (maximum, area) =>
        Math.max(
          maximum,
          area.serviceRadiusKilometres ??
            0
        ),
      0
    );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <MapPin
          aria-hidden="true"
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Service Area Summary
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            States
          </p>

          <p className="mt-2 font-heading text-4xl font-medium text-foreground">
            {states.length}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Cities
          </p>

          <p className="mt-2 font-heading text-4xl font-medium text-foreground">
            {cities.length}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <Truck
              aria-hidden="true"
              className="size-3.5"
            />
            Pickup Areas
          </p>

          <p className="mt-2 font-heading text-4xl font-medium text-foreground">
            {pickupAreas}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <ShieldCheck
              aria-hidden="true"
              className="size-3.5"
            />
            On-site Areas
          </p>

          <p className="mt-2 font-heading text-4xl font-medium text-foreground">
            {onSiteAreas}
          </p>
        </article>
      </div>

      <div className="border-t border-border p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="gold">
            <Navigation
              aria-hidden="true"
              className="mr-1 size-3.5"
            />
            Up to{" "}
            {maximumRadius.toLocaleString(
              "en-IN"
            )}{" "}
            km radius
          </Badge>

          {states.map((state) => (
            <Badge
              key={state}
              variant="neutral"
            >
              {state}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
