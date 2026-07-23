import {
  CheckCircle2,
  Clock3,
  EyeOff,
  Flag,
  ShieldAlert,
  Trash2,
  XCircle,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import type {
  ReviewReportAnalytics,
} from "@/types/review-report";

interface ReviewReportAnalyticsSummaryProps {
  readonly analytics: ReviewReportAnalytics;
}

export function ReviewReportAnalyticsSummary({
  analytics,
}: ReviewReportAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Total Reports",
      value: analytics.totalReports.toLocaleString(
        "en-IN"
      ),
      description:
        "All submitted customer review reports",
      icon: Flag,
    },
    {
      label: "Open Reports",
      value: analytics.openReports.toLocaleString(
        "en-IN"
      ),
      description:
        "Reports awaiting a final resolution",
      icon: Clock3,
    },
    {
      label: "Escalated",
      value:
        analytics.escalatedReports.toLocaleString(
          "en-IN"
        ),
      description:
        "High-risk reports under compliance review",
      icon: ShieldAlert,
    },
    {
      label: "Resolved",
      value:
        analytics.resolvedReports.toLocaleString(
          "en-IN"
        ),
      description:
        "Reports completed with moderation action",
      icon: CheckCircle2,
    },
    {
      label: "Dismissed",
      value:
        analytics.dismissedReports.toLocaleString(
          "en-IN"
        ),
      description:
        "Reports closed without review removal",
      icon: XCircle,
    },
    {
      label: "Average Resolution",
      value: `${analytics.averageResolutionHours.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}h`,
      description:
        "Average time required to close a report",
      icon: Clock3,
    },
    {
      label: "Reviews Hidden",
      value:
        analytics.hiddenReviewCount.toLocaleString(
          "en-IN"
        ),
      description:
        "Reviews removed from public visibility",
      icon: EyeOff,
    },
    {
      label: "Reviews Deleted",
      value:
        analytics.deletedReviewCount.toLocaleString(
          "en-IN"
        ),
      description:
        "Reviews permanently removed by moderation",
      icon: Trash2,
    },
  ] as const;

  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Trust and Safety Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Review Report Performance
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.38)] hover:shadow-[var(--shadow-hover)]"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
                <Icon
                  aria-hidden="true"
                  className="size-5"
                />
              </span>

              <p className="mt-5 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                {metric.value}
              </p>

              <h3 className="mt-3 text-sm font-medium text-foreground">
                {metric.label}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
