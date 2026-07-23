import {
  MapPin,
  Navigation,
  PackageCheck,
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

interface ServicePartnerCoverageCardProps {
  readonly area: ServicePartnerCoverageArea;
  readonly className?: string;
}

export function ServicePartnerCoverageCard({
  area,
  className,
}: ServicePartnerCoverageCardProps): React.JSX.Element {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        "transition-[transform,border-color,box-shadow] hover:-translate-y-0.5",
        "hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          <MapPin
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div className="flex flex-wrap justify-end gap-2">
          {area.pickupAvailable ? (
            <Badge variant="success">
              <Truck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Pickup
            </Badge>
          ) : null}

          {area.onSiteServiceAvailable ? (
            <Badge variant="gold">
              <ShieldCheck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              On-site
            </Badge>
          ) : null}
        </div>
      </div>

      <h3 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        {area.state}
      </h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {area.cities.map(
          (city) => (
            <Badge
              key={city}
              variant="neutral"
            >
              {city}
            </Badge>
          )
        )}
      </div>

      <dl className="mt-5 grid gap-3 border-t border-border pt-5">
        {typeof area.serviceRadiusKilometres ===
        "number" ? (
          <div className="flex items-center justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Navigation
                aria-hidden={true}
                className="size-4 text-[var(--color-gold-600)]"
              />
              Service Radius
            </dt>

            <dd className="text-sm font-medium text-foreground">
              {area.serviceRadiusKilometres.toLocaleString(
                "en-IN"
              )}{" "}
              km
            </dd>
          </div>
        ) : null}

        {area.postalCodes ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <PackageCheck
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Postal Codes
            </dt>

            <dd className="max-w-[60%] text-right text-xs leading-5 text-foreground">
              {area.postalCodes.join(
                ", "
              )}
            </dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
