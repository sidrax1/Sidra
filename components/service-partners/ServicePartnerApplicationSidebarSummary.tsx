import {
  Building2,
  CalendarClock,
  FileCheck2,
  MapPin,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerApplicationStatusBadge,
} from "@/components/service-partners/ServicePartnerApplicationStatusBadge";
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

interface ServicePartnerApplicationSidebarSummaryProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

export function ServicePartnerApplicationSidebarSummary({
  application,
  className,
}: ServicePartnerApplicationSidebarSummaryProps): React.JSX.Element {
  const complete =
    application.legalName.trim()
      .length > 0 &&
    application.displayName.trim()
      .length > 0 &&
    application.capabilities
      .length > 0 &&
    application.coverageStates
      .length > 0 &&
    application.documentPaths
      .length > 0;

  return (
    <aside
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="font-mono text-xs text-muted">
          Application #
          {
            application.applicationNumber
          }
        </p>

        <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          {
            application.displayName
          }
        </h2>

        <p className="mt-1 text-sm text-muted">
          {application.legalName}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <ServicePartnerApplicationStatusBadge
            status={
              application.status
            }
          />

          <Badge variant="neutral">
            {application.partnerType.replace(
              /([A-Z])/g,
              " $1"
            )}
          </Badge>
        </div>
      </header>

      <div className="grid gap-5 p-6">
        <dl className="grid gap-4">
          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Building2
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Legal Name
            </dt>

            <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
              {
                application.legalName
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <UserRound
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Contact
            </dt>

            <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
              {
                application.contact
                  .contactName
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <MapPin
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Location
            </dt>

            <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
              {
                application
                  .registeredAddress
                  .city
              }
              ,{" "}
              {
                application
                  .registeredAddress
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
                application.capabilities
                  .length
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <FileCheck2
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Documents
            </dt>

            <dd className="text-right text-sm font-medium text-foreground">
              {
                application.documentPaths
                  .length
              }
            </dd>
          </div>

          <div className="flex items-start justify-between gap-5">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <CalendarClock
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Submitted
            </dt>

            <dd className="max-w-[60%] text-right text-sm font-medium text-foreground">
              {application.submittedAt
                ? formatDateTime(
                    application.submittedAt
                  )
                : "Not submitted"}
            </dd>
          </div>
        </dl>

        <div className="border-t border-border pt-5">
          <Badge
            variant={
              complete
                ? "success"
                : "warning"
            }
          >
            {complete
              ? "Profile Complete"
              : "Profile Incomplete"}
          </Badge>
        </div>
      </div>
    </aside>
  );
}
