import {
  BadgeCheck,
  Building2,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerProfileOverviewProps {
  readonly partner: ServicePartner;
  readonly className?: string;
}

export function ServicePartnerProfileOverview({
  className,
  partner,
}: ServicePartnerProfileOverviewProps): React.JSX.Element {
  const activeCapabilities =
    partner.capabilities.filter(
      (capability) =>
        capability.active
    );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <Building2
            aria-hidden={true}
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Partner Overview
          </h2>
        </div>

        {partner.verification
          .status === "verified" ? (
          <Badge variant="success">
            <BadgeCheck
              aria-hidden={true}
              className="mr-1 size-3.5"
            />
            Verified
          </Badge>
        ) : null}
      </header>

      <div className="grid gap-6 p-6">
        <div>
          <h3 className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            {partner.displayName}
          </h3>

          <p className="mt-2 text-sm text-muted">
            {partner.legalName}
          </p>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-muted">
            {partner.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
            <MapPin
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
              Location
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {
                partner.registeredAddress
                  .city
              }
              ,{" "}
              {
                partner.registeredAddress
                  .state
              }
            </p>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
            <Wrench
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
              Capabilities
            </p>

            <p className="mt-2 font-heading text-3xl font-medium text-foreground">
              {
                activeCapabilities.length
              }
            </p>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
            <Star
              aria-hidden={true}
              className="size-5 text-[var(--color-gold-600)]"
            />

            <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
              Rating
            </p>

            <p className="mt-2 font-heading text-3xl font-medium text-foreground">
              {partner.performance.customerRating.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }
              )}
              /5
            </p>
          </article>

          <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
            <ShieldCheck
              aria-hidden={true}
              className="size-5 text-[var(--color-success)]"
            />

            <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
              Quality Score
            </p>

            <p className="mt-2 font-heading text-3xl font-medium text-foreground">
              {
                partner.performance
                  .qualityScore
              }
              /100
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
