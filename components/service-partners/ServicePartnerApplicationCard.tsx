"use client";

import {
  ArrowUpRight,
  Building2,
  CalendarClock,
  FileCheck2,
  MapPin,
  MoreVertical,
  ShieldAlert,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Card,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationCardProps {
  readonly application: ServicePartnerApplication;
  readonly loading?: boolean;
  readonly className?: string;
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

const statusLabels: Record<
  ServicePartnerApplication["status"],
  string
> = {
  draft: "Draft",
  submitted: "Submitted",
  underReview: "Under Review",
  additionalInformationRequired:
    "Information Required",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const partnerTypeLabels: Record<
  ServicePartnerApplication["partnerType"],
  string
> = {
  repairStudio:
    "Repair Studio",
  inspectionCentre:
    "Inspection Centre",
  logisticsPartner:
    "Logistics Partner",
  installationPartner:
    "Installation Partner",
  restorationSpecialist:
    "Restoration Specialist",
  qualityAssuranceCentre:
    "Quality Assurance Centre",
  multiServicePartner:
    "Multi-service Partner",
};

export function ServicePartnerApplicationCard({
  application,
  className,
  loading = false,
  onApprove,
  onOpen,
  onReject,
  onRequestInformation,
}: ServicePartnerApplicationCardProps): React.JSX.Element {
  const reviewable =
    application.status ===
      "submitted" ||
    application.status ===
      "underReview" ||
    application.status ===
      "additionalInformationRequired";

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
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.42)]",
        "hover:shadow-[var(--shadow-hover)]",
        application.status ===
          "rejected" &&
          "border-[color:rgb(145_59_59_/_0.34)]",
        className
      )}
    >
      <header className="flex items-start justify-between gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={statusVariant}
            >
              {
                statusLabels[
                  application.status
                ]
              }
            </Badge>

            <Badge variant="neutral">
              <Building2
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              {
                partnerTypeLabels[
                  application
                    .partnerType
                ]
              }
            </Badge>
          </div>

          <p className="mt-4 font-mono text-xs text-muted">
            Application #
            {
              application.applicationNumber
            }
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.035em] text-foreground">
            {application.displayName}
          </h2>

          <p className="mt-1 text-sm text-muted">
            {application.legalName}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <IconButton
              label="Application actions"
              icon={
                <MoreVertical
                  aria-hidden={true}
                />
              }
              appearance="ghost"
              disabled={loading}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                onOpen(application)
              }
            >
              Open application
            </DropdownMenuItem>

            {reviewable &&
            onApprove ? (
              <DropdownMenuItem
                onSelect={() =>
                  onApprove(
                    application
                  )
                }
              >
                Approve application
              </DropdownMenuItem>
            ) : null}

            {reviewable &&
            onRequestInformation ? (
              <DropdownMenuItem
                onSelect={() =>
                  onRequestInformation(
                    application
                  )
                }
              >
                Request information
              </DropdownMenuItem>
            ) : null}

            {reviewable &&
            onReject ? (
              <DropdownMenuItem
                destructive
                onSelect={() =>
                  onReject(
                    application
                  )
                }
              >
                Reject application
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="grid gap-6 p-5">
        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-7 text-muted">
          {application.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {application.capabilities
            .slice(0, 5)
            .map(
              (capability) => (
                <ServicePartnerCapabilityBadge
                  key={capability}
                  capability={
                    capability
                  }
                />
              )
            )}

          {application.capabilities
            .length > 5 ? (
            <Badge variant="neutral">
              +
              {application.capabilities
                .length - 5}{" "}
              more
            </Badge>
          ) : null}
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <UserRound
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Primary Contact
            </dt>

            <dd className="mt-3">
              <p className="text-sm font-medium text-foreground">
                {
                  application.contact
                    .contactName
                }
              </p>

              <p className="mt-1 break-all text-xs text-muted">
                {
                  application.contact
                    .email
                }
              </p>

              <p className="mt-1 text-xs text-muted">
                {
                  application.contact
                    .phoneNumber
                }
              </p>
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <MapPin
                aria-hidden={true}
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Registered Location
            </dt>

            <dd className="mt-3 text-sm font-medium text-foreground">
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

              <p className="mt-1 text-xs font-normal text-muted">
                {
                  application
                    .registeredAddress
                    .postalCode
                }
              </p>
            </dd>
          </div>
        </dl>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
              <Wrench
                aria-hidden={true}
                className="size-3.5"
              />
              Capabilities
            </p>

            <p className="mt-2 font-heading text-2xl font-medium text-foreground">
              {application.capabilities.length.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
              <MapPin
                aria-hidden={true}
                className="size-3.5"
              />
              Coverage
            </p>

            <p className="mt-2 font-heading text-2xl font-medium text-foreground">
              {application.coverageStates.length.toLocaleString(
                "en-IN"
              )}{" "}
              states
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted">
              <FileCheck2
                aria-hidden={true}
                className="size-3.5"
              />
              Documents
            </p>

            <p className="mt-2 font-heading text-2xl font-medium text-foreground">
              {application.documentPaths.length.toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        </div>

        {application.reviewerNote ? (
          <section
            className={cn(
              "flex items-start gap-3 rounded-[var(--radius-md)] border p-4",
              application.status ===
                "rejected"
                ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
                : "border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)]"
            )}
          >
            <ShieldAlert
              aria-hidden={true}
              className={cn(
                "mt-0.5 size-4 shrink-0",
                application.status ===
                  "rejected"
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-gold-600)]"
              )}
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-foreground">
                Reviewer Note
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                {
                  application.reviewerNote
                }
              </p>
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
          <span className="inline-flex items-center gap-2 text-xs text-muted">
            <CalendarClock
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {application.submittedAt
              ? `Submitted ${formatDateTime(
                  application.submittedAt
                )}`
              : `Created ${formatDateTime(
                  application.createdAt
                )}`}
          </span>

          <Button
            variant="outline"
            disabled={loading}
            onClick={() =>
              onOpen(application)
            }
          >
            Review Application
            <ArrowUpRight
              aria-hidden={true}
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
