import {
  BadgeIndianRupee,
  BadgeCheck,
  Clock3,
  ShieldAlert,
  Star,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  Surface,
} from "@/components/ui/Surface";
import {
  formatCurrency,
} from "@/lib/currency";
import type {
  ServicePartnerAnalytics,
} from "@/types/service-partner";

interface ServicePartnerAnalyticsSummaryProps {
  readonly analytics: ServicePartnerAnalytics;
}

export function ServicePartnerAnalyticsSummary({
  analytics,
}: ServicePartnerAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Total Partners",
      value:
        analytics.totalPartners.toLocaleString(
          "en-IN"
        ),
      description:
        "All partner profiles in the service network",
      icon: UsersRound,
    },
    {
      label: "Active Partners",
      value:
        analytics.activePartners.toLocaleString(
          "en-IN"
        ),
      description:
        "Verified and operational service partners",
      icon: BadgeCheck,
    },
    {
      label: "Pending Verification",
      value:
        analytics.pendingVerification.toLocaleString(
          "en-IN"
        ),
      description:
        "Partners awaiting review or document verification",
      icon: ShieldAlert,
    },
    {
      label: "Accepting Assignments",
      value:
        analytics.acceptingAssignments.toLocaleString(
          "en-IN"
        ),
      description:
        "Partners currently available for new work",
      icon: Wrench,
    },
    {
      label: "Active Assignments",
      value:
        analytics.activeAssignments.toLocaleString(
          "en-IN"
        ),
      description:
        "Open assignments across the service network",
      icon: UsersRound,
    },
    {
      label: "Completed Assignments",
      value:
        analytics.completedAssignments.toLocaleString(
          "en-IN"
        ),
      description:
        "Successfully completed service assignments",
      icon: BadgeCheck,
    },
    {
      label: "Average Completion",
      value: `${analytics.averageCompletionHours.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}h`,
      description:
        "Average assignment completion time",
      icon: Clock3,
    },
    {
      label: "Average Quality",
      value: `${analytics.averageQualityScore.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}/100`,
      description:
        "Network-wide verified quality score",
      icon: BadgeCheck,
    },
    {
      label: "Customer Rating",
      value: `${analytics.averageCustomerRating.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }
      )}/5`,
      description:
        "Average customer service rating",
      icon: Star,
    },
    {
      label: "Gross Service Value",
      value: formatCurrency(
        analytics.grossServiceValuePaise /
          100
      ),
      description:
        "Total approved value of service assignments",
      icon: BadgeIndianRupee,
    },
    {
      label: "Partner Payable",
      value: formatCurrency(
        analytics.partnerPayableValuePaise /
          100
      ),
      description:
        "Total value payable to service partners",
      icon: BadgeIndianRupee,
    },
    {
      label: "Platform Revenue",
      value: formatCurrency(
        analytics.platformRevenuePaise /
          100
      ),
      description:
        "Service network revenue retained by Sidra",
      icon: BadgeIndianRupee,
    },
  ] as const;

  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Service Network Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Partner Performance
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Verification, availability, assignment delivery, service
          quality and financial performance across the Sidra partner
          network.
        </p>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(
          (metric) => {
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

                <p className="mt-5 break-words font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                  {
                    metric.value
                  }
                </p>

                <h3 className="mt-3 text-sm font-medium text-foreground">
                  {
                    metric.label
                  }
                </h3>

                <p className="mt-1 text-xs leading-5 text-muted">
                  {
                    metric.description
                  }
                </p>
              </article>
            );
          }
        )}
      </div>
    </Surface>
  );
}
