import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";
import type {
  RefundAnalytics,
} from "@/services/refundService";

interface RefundAnalyticsSummaryProps {
  readonly analytics: RefundAnalytics;
}

export function RefundAnalyticsSummary({
  analytics,
}: RefundAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Total Refunds",
      value:
        analytics.totalRefunds.toLocaleString(
          "en-IN"
        ),
      description:
        "All refund requests recorded",
      icon: RefreshCcw,
    },
    {
      label: "Pending Review",
      value:
        analytics.pendingRefunds.toLocaleString(
          "en-IN"
        ),
      description:
        "Requests awaiting a decision",
      icon: Clock3,
    },
    {
      label: "Processing",
      value:
        analytics.processingRefunds.toLocaleString(
          "en-IN"
        ),
      description:
        "Refunds currently with providers",
      icon: LoaderCircle,
    },
    {
      label: "Completed",
      value:
        analytics.completedRefunds.toLocaleString(
          "en-IN"
        ),
      description:
        "Successfully returned payments",
      icon: CheckCircle2,
    },
    {
      label: "Failed",
      value:
        analytics.failedRefunds.toLocaleString(
          "en-IN"
        ),
      description:
        "Provider or settlement failures",
      icon: XCircle,
    },
    {
      label: "Approved Value",
      value: formatCurrency(
        analytics.approvedValuePaise /
          100
      ),
      description:
        "Total value approved for refund",
      icon: BadgeIndianRupee,
    },
    {
      label: "Completed Value",
      value: formatCurrency(
        analytics.completedValuePaise /
          100
      ),
      description:
        "Successfully refunded value",
      icon: CheckCircle2,
    },
    {
      label: "Average Processing",
      value: `${analytics.averageProcessingHours.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}h`,
      description:
        "Average time from approval to completion",
      icon: Clock3,
    },
  ] as const;

  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Financial Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Refund Performance
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon =
            metric.icon;

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
                {
                  metric.description
                }
              </p>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
