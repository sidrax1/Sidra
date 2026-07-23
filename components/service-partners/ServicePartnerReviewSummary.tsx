import {
  BadgeCheck,
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
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerReviewSummaryProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

export function ServicePartnerReviewSummary({
  application,
  className,
}: ServicePartnerReviewSummaryProps): React.JSX.Element {
  const submitted =
    Boolean(
      application.submittedAt
    );

  const reviewed =
    Boolean(
      application.reviewedAt
    );

  const reviewCompleted =
    application.status ===
      "approved" ||
    application.status ===
      "rejected";

  const checks = [
    {
      label:
        "Applicant identity",
      description:
        application.contact
          .contactName,
      complete:
        application.contact
          .contactName.trim()
          .length >= 2,
      icon: UserRound,
    },
    {
      label:
        "Registered address",
      description: `${application.registeredAddress.city}, ${application.registeredAddress.state}`,
      complete:
        application
          .registeredAddress
          .postalCode.length ===
        6,
      icon: MapPin,
    },
    {
      label:
        "Service capabilities",
      description: `${application.capabilities.length} capability selections`,
      complete:
        application.capabilities
          .length > 0,
      icon: Wrench,
    },
    {
      label:
        "Coverage states",
      description: `${application.coverageStates.length} states`,
      complete:
        application.coverageStates
          .length > 0,
      icon: MapPin,
    },
    {
      label:
        "Verification documents",
      description: `${application.documentPaths.length} files`,
      complete:
        application.documentPaths
          .length > 0,
      icon: FileCheck2,
    },
    {
      label:
        "Application submitted",
      description: submitted
        ? "Submission recorded"
        : "Awaiting submission",
      complete: submitted,
      icon: BadgeCheck,
    },
  ] as const;

  const completedChecks =
    checks.filter(
      (check) =>
        check.complete
    ).length;

  const completionPercentage =
    Math.round(
      (completedChecks /
        checks.length) *
        100
    );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex flex-col gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Review Readiness
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Application Summary
          </h2>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            {completionPercentage}
            %
          </p>

          <p className="mt-1 text-xs text-muted">
            profile completeness
          </p>
        </div>
      </header>

      <div className="p-6">
        <div className="h-3 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-[var(--color-gold-500)] transition-[width]"
            style={{
              width: `${completionPercentage}%`,
            }}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {checks.map((check) => {
            const Icon =
              check.icon;

            return (
              <article
                key={check.label}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-5",
                  check.complete
                    ? "border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.05)]"
                    : "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.05)]"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full border",
                      check.complete
                        ? "border-[color:rgb(62_107_82_/_0.3)] text-[var(--color-success)]"
                        : "border-[color:rgb(173_118_38_/_0.3)] text-[var(--color-warning)]"
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className="size-4"
                    />
                  </span>

                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {check.label}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      {
                        check.description
                      }
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <Badge
            variant={
              submitted
                ? "success"
                : "warning"
            }
          >
            {submitted
              ? "Submitted"
              : "Not Submitted"}
          </Badge>

          <Badge
            variant={
              reviewed
                ? "gold"
                : "neutral"
            }
          >
            {reviewed
              ? "Reviewed"
              : "Review Pending"}
          </Badge>

          <Badge
            variant={
              reviewCompleted
                ? application.status ===
                  "approved"
                  ? "success"
                  : "error"
                : "neutral"
            }
          >
            {reviewCompleted
              ? application.status ===
                "approved"
                ? "Approved"
                : "Rejected"
              : "Decision Pending"}
          </Badge>
        </div>

        {application.reviewerNote ? (
          <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <ShieldAlert
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
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
          </div>
        ) : null}
      </div>
    </section>
  );
}
