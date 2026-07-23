import {
  Gauge,
  PauseCircle,
  UsersRound,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerCapacityCardProps {
  readonly partner: ServicePartner;
  readonly className?: string;
}

export function ServicePartnerCapacityCard({
  className,
  partner,
}: ServicePartnerCapacityCardProps): React.JSX.Element {
  const availableCapacity =
    Math.max(
      partner.maximumConcurrentAssignments -
        partner.currentAssignmentCount,
      0
    );

  const utilizationPercentage =
    partner.maximumConcurrentAssignments >
    0
      ? Math.min(
          Math.round(
            (partner.currentAssignmentCount /
              partner.maximumConcurrentAssignments) *
              100
          ),
          100
        )
      : 0;

  const nearCapacity =
    utilizationPercentage >= 80;

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          <Gauge
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <Badge
          variant={
            partner.acceptingAssignments
              ? "success"
              : "warning"
          }
        >
          {partner.acceptingAssignments
            ? "Accepting Work"
            : "Paused"}
        </Badge>
      </div>

      <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        Assignment Capacity
      </h2>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-background p-5">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.13em] text-muted">
              Current Utilisation
            </p>

            <p className="mt-2 font-heading text-5xl font-medium tracking-[-0.045em] text-foreground">
              {
                utilizationPercentage
              }
              %
            </p>
          </div>

          <UsersRound
            aria-hidden={true}
            className={cn(
              "size-8",
              nearCapacity
                ? "text-[var(--color-warning)]"
                : "text-[var(--color-success)]"
            )}
          />
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-border">
          <div
            className={cn(
              "h-full rounded-full transition-[width]",
              utilizationPercentage >=
                90
                ? "bg-[var(--color-error)]"
                : nearCapacity
                  ? "bg-[var(--color-warning)]"
                  : "bg-[var(--color-success)]"
            )}
            style={{
              width: `${utilizationPercentage}%`,
            }}
          />
        </div>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="text-xs text-muted">
            Active
          </dt>

          <dd className="mt-2 font-heading text-3xl text-foreground">
            {
              partner.currentAssignmentCount
            }
          </dd>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="text-xs text-muted">
            Maximum
          </dt>

          <dd className="mt-2 font-heading text-3xl text-foreground">
            {
              partner.maximumConcurrentAssignments
            }
          </dd>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <dt className="text-xs text-muted">
            Available
          </dt>

          <dd className="mt-2 font-heading text-3xl text-foreground">
            {
              availableCapacity
            }
          </dd>
        </div>
      </dl>

      {!partner.acceptingAssignments ? (
        <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)] p-4">
          <PauseCircle
            aria-hidden={true}
            className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]"
          />

          <p className="text-sm leading-6 text-muted">
            New assignments are
            paused even though capacity
            may be available.
          </p>
        </div>
      ) : null}
    </section>
  );
}
