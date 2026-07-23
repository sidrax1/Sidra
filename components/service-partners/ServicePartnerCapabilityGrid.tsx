import {
  BadgeIndianRupee,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  Price,
} from "@/components/ui/Price";
import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import type {
  ServicePartnerCapabilityProfile,
} from "@/types/service-partner";

interface ServicePartnerCapabilityGridProps {
  readonly capabilities: readonly ServicePartnerCapabilityProfile[];
}

export function ServicePartnerCapabilityGrid({
  capabilities,
}: ServicePartnerCapabilityGridProps): React.JSX.Element {
  const orderedCapabilities = [
    ...capabilities,
  ].sort(
    (first, second) =>
      Number(second.active) -
      Number(first.active)
  );

  return (
    <section
      aria-label="Service capabilities"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {orderedCapabilities.map(
        (capability) => (
          <article
            key={
              capability.capability
            }
            className={[
              "rounded-[var(--radius-lg)] border bg-card p-5 shadow-[var(--shadow-card)]",
              capability.active
                ? "border-border"
                : "border-border opacity-60",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4">
              <ServicePartnerCapabilityBadge
                capability={
                  capability.capability
                }
              />

              <Badge
                variant={
                  capability.active
                    ? "success"
                    : "neutral"
                }
              >
                {capability.active
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>

            {capability.description ? (
              <p className="mt-4 text-sm leading-7 text-muted">
                {
                  capability.description
                }
              </p>
            ) : null}

            <dl className="mt-5 grid gap-3 border-t border-border pt-5">
              {typeof capability.minimumTurnaroundHours ===
              "number" ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-sm text-muted">
                    <Clock3
                      aria-hidden="true"
                      className="size-4 text-[var(--color-gold-600)]"
                    />
                    Turnaround
                  </dt>

                  <dd className="text-sm font-medium text-foreground">
                    {
                      capability.minimumTurnaroundHours
                    }
                    {typeof capability.maximumTurnaroundHours ===
                    "number"
                      ? `–${capability.maximumTurnaroundHours}`
                      : "+"}
                    h
                  </dd>
                </div>
              ) : null}

              {typeof capability.baseServiceFeePaise ===
              "number" ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-sm text-muted">
                    <BadgeIndianRupee
                      aria-hidden="true"
                      className="size-4 text-[var(--color-gold-600)]"
                    />
                    Base Fee
                  </dt>

                  <dd>
                    <Price
                      amount={
                        capability.baseServiceFeePaise /
                        100
                      }
                      size="sm"
                    />
                  </dd>
                </div>
              ) : null}

              {typeof capability.inspectionFeePaise ===
              "number" ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="inline-flex items-center gap-2 text-sm text-muted">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-4 text-[var(--color-gold-600)]"
                    />
                    Inspection Fee
                  </dt>

                  <dd>
                    <Price
                      amount={
                        capability.inspectionFeePaise /
                        100
                      }
                      size="sm"
                    />
                  </dd>
                </div>
              ) : null}
            </dl>
          </article>
        )
      )}
    </section>
  );
}
