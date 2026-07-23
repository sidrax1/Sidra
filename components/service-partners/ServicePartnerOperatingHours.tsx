import {
  Clock3,
  Moon,
  Sun,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerOperatingHours,
} from "@/types/service-partner";

interface ServicePartnerOperatingHoursProps {
  readonly hours: readonly ServicePartnerOperatingHours[];
  readonly className?: string;
}

const dayOrder: Record<
  ServicePartnerOperatingHours["day"],
  number
> = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

export function ServicePartnerOperatingHours({
  className,
  hours,
}: ServicePartnerOperatingHoursProps): React.JSX.Element {
  const orderedHours = [
    ...hours,
  ].sort(
    (first, second) =>
      dayOrder[first.day] -
      dayOrder[second.day]
  );

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <Clock3
          aria-hidden="true"
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Operating Hours
        </h2>
      </header>

      <div className="divide-y divide-border">
        {orderedHours.map(
          (schedule) => (
            <div
              key={schedule.day}
              className="flex items-center justify-between gap-5 px-5 py-4"
            >
              <div className="inline-flex items-center gap-3">
                {schedule.open ? (
                  <Sun
                    aria-hidden="true"
                    className="size-4 text-[var(--color-gold-600)]"
                  />
                ) : (
                  <Moon
                    aria-hidden="true"
                    className="size-4 text-muted"
                  />
                )}

                <span className="text-sm font-medium capitalize text-foreground">
                  {schedule.day}
                </span>
              </div>

              {schedule.open ? (
                <span className="text-sm text-muted">
                  {
                    schedule.opensAt
                  }{" "}
                  –{" "}
                  {
                    schedule.closesAt
                  }
                </span>
              ) : (
                <Badge variant="neutral">
                  Closed
                </Badge>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
}
