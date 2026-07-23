import {
  BadgeCheck,
  CalendarClock,
  Circle,
  CircleDashed,
  FileCheck2,
  MapPinCheck,
  ShieldCheck,
} from "lucide-react";

import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerVerification,
} from "@/types/service-partner";

interface ServicePartnerVerificationTimelineProps {
  readonly verification: ServicePartnerVerification;
  readonly className?: string;
}

interface VerificationStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp?: string;
  readonly complete: boolean;
  readonly current: boolean;
  readonly icon: typeof ShieldCheck;
}

export function ServicePartnerVerificationTimeline({
  className,
  verification,
}: ServicePartnerVerificationTimelineProps): React.JSX.Element {
  const steps: readonly VerificationStep[] = [
    {
      id: "submitted",
      title: "Verification Submitted",
      description:
        "The partner submitted the required business and service information.",
      timestamp: verification.submittedAt,
      complete: Boolean(verification.submittedAt),
      current:
        verification.status ===
        "documentsPending",
      icon: FileCheck2,
    },
    {
      id: "review",
      title: "Document Review",
      description:
        "Compliance and operations teams reviewed the submitted documents.",
      timestamp: verification.reviewedAt,
      complete:
        Boolean(verification.reviewedAt) ||
        [
          "siteInspectionPending",
          "verified",
          "failed",
          "expired",
        ].includes(verification.status),
      current:
        verification.status ===
        "underReview",
      icon: CircleDashed,
    },
    {
      id: "inspection",
      title: "Site Inspection",
      description:
        "The partner location and operational capability were physically verified.",
      timestamp:
        verification.siteInspectionAt,
      complete:
        Boolean(
          verification.siteInspectionAt
        ) ||
        [
          "verified",
          "failed",
          "expired",
        ].includes(verification.status),
      current:
        verification.status ===
        "siteInspectionPending",
      icon: MapPinCheck,
    },
    {
      id: "verified",
      title: "Verification Decision",
      description:
        verification.status ===
        "failed"
          ? "The verification did not satisfy the required standards."
          : "The partner completed the verification workflow.",
      timestamp: verification.reviewedAt,
      complete: [
        "verified",
        "failed",
        "expired",
      ].includes(verification.status),
      current:
        verification.status ===
          "verified" ||
        verification.status ===
          "failed" ||
        verification.status ===
          "expired",
      icon:
        verification.status ===
        "verified"
          ? BadgeCheck
          : ShieldCheck,
    },
  ];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Compliance History
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Verification Timeline
        </h2>
      </header>

      <ol className="p-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const last =
            index === steps.length - 1;

          return (
            <li
              key={step.id}
              className="relative flex gap-4"
            >
              {!last ? (
                <span
                  aria-hidden={true}
                  className={cn(
                    "absolute left-5 top-10 h-[calc(100%-1rem)] w-px",
                    step.complete
                      ? "bg-[var(--color-gold-500)]"
                      : "bg-border"
                  )}
                />
              ) : null}

              <span
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border",
                  step.current
                    ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.1)] text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]"
                    : step.complete
                      ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.07)] text-[var(--color-success)]"
                      : "border-border bg-background text-muted"
                )}
              >
                {step.complete ||
                step.current ? (
                  <Icon
                    aria-hidden={true}
                    className="size-4"
                  />
                ) : (
                  <Circle
                    aria-hidden={true}
                    className="size-4"
                  />
                )}
              </span>

              <div className="min-w-0 flex-1 pb-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-medium text-foreground">
                    {step.title}
                  </h3>

                  {step.timestamp ? (
                    <time className="inline-flex items-center gap-2 text-xs text-muted">
                      <CalendarClock
                        aria-hidden={true}
                        className="size-3.5"
                      />
                      {formatDateTime(
                        step.timestamp
                      )}
                    </time>
                  ) : null}
                </div>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
