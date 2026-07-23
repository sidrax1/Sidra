import {
  Building2,
  CalendarClock,
  FileCheck2,
  MapPin,
  ShieldAlert,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationDetailHeaderProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

export function ServicePartnerApplicationDetailHeader({
  application,
  className,
}: ServicePartnerApplicationDetailHeaderProps): React.JSX.Element {
  const statusVariant =
    application.status ===
    "approved"
      ? "success"
      : application.status ===
            "rejected" ||
          application.status ===
            "withdrawn"
        ? "error"
        : application.status ===
            "additionalInformationRequired"
          ? "warning"
          : application.status ===
              "underReview"
            ? "gold"
            : "neutral";

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-[color:rgb(200_169_106_/_0.32)] bg-card shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_8%,rgba(200,169,106,0.36),transparent_45%)]"
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={
                statusVariant
              }
            >
              {
                application.status.replace(
                  /([A-Z])/g,
                  " $1"
                )
              }
            </Badge>

            <Badge variant="neutral">
              {
                application.partnerType.replace(
                  /([A-Z])/g,
                  " $1"
                )
              }
            </Badge>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
            Service Partner Application
          </p>

          <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
            {
              application.displayName
            }
          </h1>

          <p className="mt-3 text-lg text-white/65">
            {
              application.legalName
            }
          </p>

          <p className="mt-6 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-white/65">
            {
              application.description
            }
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <UserRound
                aria-hidden="true"
                className="size-4"
              />
              {
                application.contact
                  .contactName
              }
            </span>

            <span className="inline-flex items-center gap-2">
              <MapPin
                aria-hidden="true"
                className="size-4"
              />
              {
                application.registeredAddress
                  .city
              }
              ,{" "}
              {
                application.registeredAddress
                  .state
              }
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarClock
                aria-hidden="true"
                className="size-4"
              />
              {application.submittedAt
                ? `Submitted ${formatDateTime(
                    application.submittedAt
                  )}`
                : "Not submitted"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <Wrench
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
            Capabilities
          </p>

          <p className="mt-2 font-heading text-3xl text-foreground">
            {
              application.capabilities
                .length
            }
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <MapPin
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
            Coverage States
          </p>

          <p className="mt-2 font-heading text-3xl text-foreground">
            {
              application.coverageStates
                .length
            }
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <FileCheck2
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
            Documents
          </p>

          <p className="mt-2 font-heading text-3xl text-foreground">
            {
              application.documentPaths
                .length
            }
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          {application.reviewerId ? (
            <Building2
              aria-hidden="true"
              className="size-5 text-[var(--color-success)]"
            />
          ) : (
            <ShieldAlert
              aria-hidden="true"
              className="size-5 text-[var(--color-warning)]"
            />
          )}

          <p className="mt-3 text-xs uppercase tracking-[0.13em] text-muted">
            Review Assignment
          </p>

          <p className="mt-2 text-sm font-medium text-foreground">
            {application.reviewerId
              ? "Assigned"
              : "Unassigned"}
          </p>
        </article>
      </div>
    </header>
  );
}
