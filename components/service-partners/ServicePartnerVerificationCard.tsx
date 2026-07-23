import {
  CalendarClock,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  ServicePartnerVerificationBadge,
} from "@/components/service-partners/ServicePartnerVerificationBadge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerVerification,
} from "@/types/service-partner";

interface ServicePartnerVerificationCardProps {
  readonly verification: ServicePartnerVerification;
  readonly className?: string;
}

export function ServicePartnerVerificationCard({
  className,
  verification,
}: ServicePartnerVerificationCardProps): React.JSX.Element {
  const highRisk =
    verification.riskScore >=
    70;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-card)]",
        highRisk
          ? "border-[color:rgb(145_59_59_/_0.4)]"
          : "border-border",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck
            aria-hidden={true}
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Verification
          </h2>
        </div>

        <ServicePartnerVerificationBadge
          status={
            verification.status
          }
        />
      </header>

      <div className="grid gap-5 p-6">
        <div
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            highRisk
              ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
              : "border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)]"
          )}
        >
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Risk Score
          </p>

          <p
            className={cn(
              "mt-2 font-heading text-5xl font-medium tracking-[-0.045em]",
              highRisk
                ? "text-[var(--color-error)]"
                : "text-foreground"
            )}
          >
            {
              verification.riskScore
            }
            <span className="ml-1 text-lg text-muted">
              /100
            </span>
          </p>
        </div>

        <dl className="grid gap-4">
          {verification.submittedAt ? (
            <div className="flex items-start justify-between gap-5">
              <dt className="inline-flex items-center gap-2 text-sm text-muted">
                <CalendarClock
                  aria-hidden={true}
                  className="mt-0.5 size-4 text-[var(--color-gold-600)]"
                />
                Submitted
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {formatDateTime(
                  verification.submittedAt
                )}
              </dd>
            </div>
          ) : null}

          {verification.reviewedAt ? (
            <div className="flex items-start justify-between gap-5">
              <dt className="text-sm text-muted">
                Reviewed
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {formatDateTime(
                  verification.reviewedAt
                )}
              </dd>
            </div>
          ) : null}

          {verification.siteInspectionAt ? (
            <div className="flex items-start justify-between gap-5">
              <dt className="text-sm text-muted">
                Site Inspection
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {formatDateTime(
                  verification.siteInspectionAt
                )}
              </dd>
            </div>
          ) : null}

          {verification.expiresAt ? (
            <div className="flex items-start justify-between gap-5">
              <dt className="text-sm text-muted">
                Verification Expires
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {formatDateTime(
                  verification.expiresAt
                )}
              </dd>
            </div>
          ) : null}
        </dl>

        {verification.failureReason ? (
          <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)] p-4">
            <ShieldAlert
              aria-hidden={true}
              className="mt-0.5 size-4 shrink-0 text-[var(--color-error)]"
            />

            <p className="text-sm leading-6 text-muted">
              {
                verification.failureReason
              }
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
