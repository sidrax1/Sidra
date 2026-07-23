import {
  BadgeIndianRupee,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  PackageSearch,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";
import type {
  ReturnAnalytics,
} from "@/types/return";

interface ReturnAnalyticsSummaryProps {
  readonly analytics: ReturnAnalytics;
}

export function ReturnAnalyticsSummary({
  analytics,
}: ReturnAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Total Returns",
      value:
        analytics.totalReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "All return requests created",
      icon: RotateCcw,
    },
    {
      label: "Open Returns",
      value:
        analytics.openReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Returns awaiting final completion",
      icon: Clock3,
    },
    {
      label: "Pending Review",
      value:
        analytics.pendingReviewReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Requests awaiting eligibility decisions",
      icon: PackageSearch,
    },
    {
      label: "Pickup Scheduled",
      value:
        analytics.pickupScheduledReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Approved reverse-logistics collections",
      icon: Truck,
    },
    {
      label: "Inspection Pending",
      value:
        analytics.inspectionPendingReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Received products awaiting inspection",
      icon: ClipboardCheck,
    },
    {
      label: "Completed",
      value:
        analytics.completedReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Successfully resolved returns",
      icon: CheckCircle2,
    },
    {
      label: "Rejected",
      value:
        analytics.rejectedReturns.toLocaleString(
          "en-IN"
        ),
      description:
        "Return requests found ineligible",
      icon: XCircle,
    },
    {
      label: "Return Value",
      value: formatCurrency(
        analytics.returnValuePaise /
          100
      ),
      description:
        "Gross value of returned products",
      icon: BadgeIndianRupee,
    },
    {
      label: "Refunded Value",
      value: formatCurrency(
        analytics.refundedValuePaise /
          100
      ),
      description:
        "Customer value returned",
      icon: BadgeIndianRupee,
    },
    {
      label: "Restocking Fees",
      value: formatCurrency(
        analytics.restockingFeesPaise /
          100
      ),
      description:
        "Approved return handling deductions",
      icon: BadgeIndianRupee,
    },
    {
      label: "Resolution Time",
      value: `${analytics.averageResolutionHours.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}h`,
      description:
        "Average request-to-completion time",
      icon: Clock3,
    },
    {
      label: "Return Rate",
      value: `${analytics.returnRatePercentage.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2,
        }
      )}%`,
      description:
        "Returned orders as a share of fulfilled orders",
      icon: RotateCcw,
    },
  ] as const;

  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Reverse Logistics Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Return Performance
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
                  aria-hidden={true}
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
