import Image from "next/image";
import {
  BadgeCheck,
  Building2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentPartnerCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly partner?: ServicePartner | null;
  readonly className?: string;
}

export function ServicePartnerAssignmentPartnerCard({
  assignment,
  className,
  partner,
}: ServicePartnerAssignmentPartnerCardProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <Building2
          aria-hidden="true"
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Assigned Partner
        </h2>
      </header>

      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background">
            {partner?.logoURL ? (
              <Image
                src={partner.logoURL}
                alt={
                  partner.displayName
                }
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-8 text-[var(--color-gold-600)]"
                />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                {partner?.displayName ??
                  assignment.partnerName}
              </h3>

              {partner?.verification
                .status ===
              "verified" ? (
                <BadgeCheck
                  aria-label="Verified service partner"
                  className="size-5 shrink-0 text-[var(--color-success)]"
                />
              ) : null}
            </div>

            <p className="mt-1 font-mono text-xs text-muted">
              Partner ID:{" "}
              {assignment.partnerId}
            </p>
          </div>
        </div>

        {partner ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[var(--radius-md)] border border-border bg-background p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
                <Star
                  aria-hidden="true"
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                Customer Rating
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

            <article className="rounded-[var(--radius-md)] border border-border bg-background p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
                <BadgeCheck
                  aria-hidden="true"
                  className="size-3.5 text-[var(--color-success)]"
                />
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
        ) : null}

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5 text-xs text-muted">
          {partner ? (
            <span className="inline-flex items-center gap-2">
              <MapPin
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              {
                partner.registeredAddress
                  .city
              }
              ,{" "}
              {
                partner.registeredAddress
                  .state
              }
            </span>
          ) : null}

          <Badge variant="neutral">
            {assignment.capability.replace(
              /([A-Z])/g,
              " $1"
            )}
          </Badge>
        </div>
      </div>
    </section>
  );
}
