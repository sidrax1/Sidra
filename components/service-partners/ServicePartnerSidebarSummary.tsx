import {
  BadgeCheck,
  CalendarClock,
  Gauge,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerStatusBadge,
} from "@/components/service-partners/ServicePartnerStatusBadge";
import {
  ServicePartnerVerificationBadge,
} from "@/components/service-partners/ServicePartnerVerificationBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDate,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerSidebarSummaryProps {
  readonly partner: ServicePartner;
  readonly className?: string;
}

export function ServicePartnerSidebarSummary({
  className,
  partner,
}: ServicePartnerSidebarSummaryProps): React.JSX.Element {
  const activeCapabilities =
    partner.capabilities.filter(
      (capability) =>
        capability.active
    );

  const remainingCapacity =
    Math.max(
      partner.maximumConcurrentAssignments -
        partner.currentAssignmentCount,
      0
    );

  const verificationExpired =
    Boolean(
      partner.verification
        .expiresAt
    ) &&
    new Date(
      partner.verification
        .expiresAt ?? ""
    ).getTime() < Date.now();

  return (
    <aside
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="font-mono text-xs text-muted">
          Partner #
          {partner.partnerNumber}
        </p>

        <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          {partner.displayName}
        </h2>

        <p className="mt-1 text-sm text-muted">
          {partner.legalName}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <ServicePartnerStatusBadge
            status={partner.status}
          />

          <ServicePartnerVerificationBadge
            status={
              partner.verification
                .status
            }
          />
        </div>
      </header>

      <div className="grid gap-5 p-6">
        <dl className="grid gap-4">
          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <MapPin
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Location
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {
                partner.registeredAddress
                  .city
              }
              ,{" "}
              {
                partner.registeredAddress
                  .state
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Wrench
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Capabilities
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {
                activeCapabilities.length
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Star
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Rating
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {partner.performance.customerRating.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }
              )}
              /5
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <BadgeCheck
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-success)]"
              />
              Quality Score
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {
                partner.performance
                  .qualityScore
              }
              /100
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Gauge
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Available Capacity
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {remainingCapacity}
            </dd>
          </div>

          {partner.activatedAt ? (
            <div className="flex items-start justify-between gap-5">
              <dt className="inline-flex items-center gap-2 text-sm text-muted">
                <CalendarClock
                  aria-hidden={true}
                  className="mt-0.5 size-4 text-[var(--color-gold-600)]"
                />
                Activated
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {formatDate(
                  partner.activatedAt
                )}
              </dd>
            </div>
          ) : null}
        </dl>

        <section className="border-t border-border pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Network Readiness
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge
              variant={
                partner.acceptingAssignments
                  ? "success"
                  : "warning"
              }
            >
              {partner.acceptingAssignments
                ? "Accepting Work"
                : "Work Paused"}
            </Badge>

            <Badge
              variant={
                remainingCapacity >
                0
                  ? "gold"
                  : "error"
              }
            >
              {remainingCapacity >
              0
                ? `${remainingCapacity} Slots`
                : "At Capacity"}
            </Badge>

            <Badge
              variant={
                verificationExpired
                  ? "error"
                  : "success"
              }
            >
              <ShieldCheck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              {verificationExpired
                ? "Verification Expired"
                : "Verification Valid"}
            </Badge>
          </div>
        </section>
      </div>
    </aside>
  );
}
