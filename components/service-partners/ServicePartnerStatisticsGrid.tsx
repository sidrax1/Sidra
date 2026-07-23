import {
  BadgeCheck,
  Building2,
  CircleDashed,
  PauseCircle,
  ShieldAlert,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerStatisticsGridProps {
  readonly partners: readonly ServicePartner[];
  readonly className?: string;
}

interface ServicePartnerStatistic {
  readonly label: string;
  readonly value: number;
  readonly description: string;
  readonly icon:
    typeof Building2;
  readonly tone:
    | "neutral"
    | "gold"
    | "success"
    | "warning"
    | "error";
}

const toneClasses: Record<
  ServicePartnerStatistic["tone"],
  string
> = {
  neutral:
    "border-border bg-background text-foreground",
  gold:
    "border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] text-[var(--color-gold-600)]",
  success:
    "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)] text-[var(--color-success)]",
  warning:
    "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)] text-[var(--color-warning)]",
  error:
    "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)] text-[var(--color-error)]",
};

export function ServicePartnerStatisticsGrid({
  className,
  partners,
}: ServicePartnerStatisticsGridProps): React.JSX.Element {
  const statistics: readonly ServicePartnerStatistic[] =
    [
      {
        label: "Total Partners",
        value: partners.length,
        description:
          "All partners currently available in this result set.",
        icon: Building2,
        tone: "neutral",
      },
      {
        label: "Active",
        value: partners.filter(
          (partner) =>
            partner.status ===
            "active"
        ).length,
        description:
          "Verified partners with active service profiles.",
        icon: BadgeCheck,
        tone: "success",
      },
      {
        label: "Accepting Work",
        value: partners.filter(
          (partner) =>
            partner.status ===
              "active" &&
            partner.acceptingAssignments &&
            partner.currentAssignmentCount <
              partner.maximumConcurrentAssignments
        ).length,
        description:
          "Partners eligible for immediate assignment matching.",
        icon: Wrench,
        tone: "gold",
      },
      {
        label: "Verification Pending",
        value: partners.filter(
          (partner) =>
            partner.verification
              .status !==
              "verified" &&
            partner.verification
              .status !== "failed" &&
            partner.verification
              .status !== "expired"
        ).length,
        description:
          "Profiles still completing verification requirements.",
        icon: CircleDashed,
        tone: "warning",
      },
      {
        label: "Paused",
        value: partners.filter(
          (partner) =>
            !partner.acceptingAssignments ||
            partner.status ===
              "temporarilyUnavailable"
        ).length,
        description:
          "Partners not accepting new service work.",
        icon: PauseCircle,
        tone: "warning",
      },
      {
        label: "Restricted",
        value: partners.filter(
          (partner) =>
            partner.status ===
              "suspended" ||
            partner.status ===
              "rejected" ||
            partner.status ===
              "archived"
        ).length,
        description:
          "Profiles blocked from normal service assignment activity.",
        icon: ShieldAlert,
        tone: "error",
      },
      {
        label: "Active Assignments",
        value: partners.reduce(
          (
            total,
            partner
          ) =>
            total +
            partner.currentAssignmentCount,
          0
        ),
        description:
          "Combined active assignment workload across these partners.",
        icon: UsersRound,
        tone: "neutral",
      },
    ];

  return (
    <section
      aria-label="Service partner statistics"
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {statistics.map(
        (statistic) => {
          const Icon =
            statistic.icon;

          return (
            <article
              key={statistic.label}
              className={cn(
                "rounded-[var(--radius-lg)] border p-5 shadow-[var(--shadow-card)]",
                toneClasses[
                  statistic.tone
                ]
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-10 items-center justify-center rounded-full border border-current/20 bg-card/60">
                  <Icon
                    aria-hidden={true}
                    className="size-4"
                  />
                </span>

                <p className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                  {statistic.value.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <h3 className="mt-5 text-sm font-medium text-foreground">
                {statistic.label}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                {
                  statistic.description
                }
              </p>
            </article>
          );
        }
      )}
    </section>
  );
}
