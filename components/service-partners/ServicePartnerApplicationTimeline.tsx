import {
  BadgeCheck,
  Circle,
  CircleDashed,
  FileQuestion,
  FileText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationTimelineProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

interface ApplicationTimelineStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp?: string;
  readonly complete: boolean;
  readonly current: boolean;
  readonly icon: typeof FileText;
}

export function ServicePartnerApplicationTimeline({
  application,
  className,
}: ServicePartnerApplicationTimelineProps): React.JSX.Element {
  const submitted =
    Boolean(
      application.submittedAt
    );

  const reviewed =
    Boolean(
      application.reviewedAt
    );

  const informationRequired =
    application.status ===
    "additionalInformationRequired";

  const approved =
    application.status ===
    "approved";

  const rejected =
    application.status ===
    "rejected";

  const steps: readonly ApplicationTimelineStep[] =
    [
      {
        id: "created",
        title:
          "Application Created",
        description:
          "The applicant created a Sidra service-partner application.",
        timestamp:
          application.createdAt,
        complete: true,
        current:
          application.status ===
          "draft",
        icon: FileText,
      },
      {
        id: "submitted",
        title:
          "Application Submitted",
        description:
          "Business, contact, coverage and verification information was submitted.",
        timestamp:
          application.submittedAt,
        complete: submitted,
        current:
          application.status ===
          "submitted",
        icon: ShieldCheck,
      },
      {
        id: "review",
        title:
          "Verification Review",
        description:
          "The compliance team reviewed the application and supporting information.",
        timestamp:
          application.reviewedAt,
        complete:
          reviewed ||
          informationRequired ||
          approved ||
          rejected,
        current:
          application.status ===
          "underReview",
        icon: CircleDashed,
      },
      {
        id: "information",
        title:
          "Information Resolution",
        description:
          informationRequired
            ? "The applicant must provide additional documents or clarification."
            : "No unresolved information request is active.",
        timestamp:
          informationRequired
            ? application.reviewedAt
            : undefined,
        complete:
          !informationRequired &&
          (approved ||
            rejected),
        current:
          informationRequired,
        icon: FileQuestion,
      },
      {
        id: "decision",
        title:
          "Final Decision",
        description: approved
          ? "The application was approved and the partner onboarding process was activated."
          : rejected
            ? "The application was rejected after review."
            : "A final approval or rejection decision has not been recorded.",
        timestamp:
          approved || rejected
            ? application.reviewedAt
            : undefined,
        complete:
          approved || rejected,
        current:
          approved || rejected,
        icon: approved
          ? BadgeCheck
          : rejected
            ? XCircle
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
          Application History
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Review Timeline
        </h2>
      </header>

      <ol className="p-6">
        {steps.map(
          (
            step,
            index
          ) => {
            const Icon =
              step.icon;

            const finalStep =
              index ===
              steps.length - 1;

            return (
              <li
                key={step.id}
                className="relative flex gap-4"
              >
                {!finalStep ? (
                  <span
                    aria-hidden="true"
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
                      ? rejected
                        ? "border-[var(--color-error)] bg-[color:rgb(145_59_59_/_0.08)] text-[var(--color-error)]"
                        : "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.1)] text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]"
                      : step.complete
                        ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.07)] text-[var(--color-success)]"
                        : "border-border bg-background text-muted"
                  )}
                >
                  {step.complete ||
                  step.current ? (
                    <Icon
                      aria-hidden="true"
                      className="size-4"
                    />
                  ) : (
                    <Circle
                      aria-hidden="true"
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
                      <time className="text-xs text-muted">
                        {formatDateTime(
                          step.timestamp
                        )}
                      </time>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {
                      step.description
                    }
                  </p>
                </div>
              </li>
            );
          }
        )}
      </ol>
    </section>
  );
}
