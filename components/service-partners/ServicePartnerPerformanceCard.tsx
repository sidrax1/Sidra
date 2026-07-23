import {
  BadgeCheck,
  Clock3,
  RefreshCcw,
  ShieldAlert,
  Star,
  UsersRound,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerPerformance,
} from "@/types/service-partner";

interface ServicePartnerPerformanceCardProps {
  readonly performance: ServicePartnerPerformance;
  readonly className?: string;
}

export function ServicePartnerPerformanceCard({
  className,
  performance,
}: ServicePartnerPerformanceCardProps): React.JSX.Element {
  const metrics = [
    {
      label:
        "Completed Assignments",
      value:
        performance.completedAssignments.toLocaleString(
          "en-IN"
        ),
      icon: BadgeCheck,
    },
    {
      label:
        "Active Assignments",
      value:
        performance.activeAssignments.toLocaleString(
          "en-IN"
        ),
      icon: UsersRound,
    },
    {
      label:
        "Average Completion",
      value: `${performance.averageCompletionHours.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}h`,
      icon: Clock3,
    },
    {
      label: "Customer Rating",
      value: `${performance.customerRating.toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }
      )}/5`,
      icon: Star,
    },
    {
      label: "Quality Score",
      value: `${performance.qualityScore}/100`,
      icon: BadgeCheck,
    },
    {
      label:
        "Resolution Success",
      value: `${performance.resolutionSuccessRate.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}%`,
      icon: RefreshCcw,
    },
    {
      label:
        "Repeat Service Rate",
      value: `${performance.repeatServiceRate.toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 1,
        }
      )}%`,
      icon: RefreshCcw,
    },
    {
      label: "Disputes",
      value:
        performance.disputeCount.toLocaleString(
          "en-IN"
        ),
      icon: ShieldAlert,
    },
  ] as const;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Verified Service Metrics
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Partner Performance
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon =
            metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[var(--radius-lg)] border border-border bg-background p-5"
            >
              <Icon
                aria-hidden="true"
                className="size-5 text-[var(--color-gold-600)]"
              />

              <p className="mt-4 font-heading text-3xl font-medium tracking-[-0.035em] text-foreground">
                {metric.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-muted">
                {metric.label}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
