import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

import {
  EmptyState,
} from "@/components/ui/EmptyState";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  OrderTimelineEvent,
  OrderTimelineEventType,
} from "@/types/order";

interface OrderTimelineProps {
  readonly events: readonly OrderTimelineEvent[];
  readonly className?: string;
  readonly includeInternalEvents?: boolean;
}

const eventIcons: Record<
  OrderTimelineEventType,
  React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>
> = {
  orderPlaced: Clock3,
  paymentAuthorized:
    BadgeIndianRupee,
  paymentConfirmed:
    CheckCircle2,
  orderConfirmed:
    PackageCheck,
  productionStarted:
    PackageCheck,
  orderPacked:
    PackageCheck,
  shipmentCreated: Truck,
  orderShipped: Truck,
  outForDelivery: Truck,
  orderDelivered:
    CheckCircle2,
  cancellationRequested:
    XCircle,
  orderCancelled:
    XCircle,
  returnRequested:
    RotateCcw,
  returnApproved:
    RotateCcw,
  returnReceived:
    RotateCcw,
  refundInitiated:
    RefreshCcw,
  refundCompleted:
    CheckCircle2,
};

export function OrderTimeline({
  className,
  events,
  includeInternalEvents = false,
}: OrderTimelineProps): React.JSX.Element {
  const visibleEvents = events
    .filter(
      (event) =>
        includeInternalEvents ||
        event.customerVisible
    )
    .sort((first, second) =>
      first.createdAt.localeCompare(
        second.createdAt
      )
    );

  if (visibleEvents.length === 0) {
    return (
      <EmptyState
        title="No order activity"
        description="Order, payment and delivery events will appear here."
      />
    );
  }

  return (
    <section
      aria-label="Order timeline"
      className={cn(
        "relative grid gap-4",
        className
      )}
    >
      <div
        aria-hidden={true}
        className="absolute bottom-6 left-[1.35rem] top-6 hidden w-px bg-border sm:block"
      />

      {visibleEvents.map(
        (event, index) => {
          const Icon =
            eventIcons[event.type];

          const latest =
            index ===
            visibleEvents.length - 1;

          return (
            <article
              key={event.id}
              className={cn(
                "relative rounded-[var(--radius-lg)] border bg-card p-5 sm:ml-14",
                latest
                  ? "border-[color:rgb(200_169_106_/_0.42)] shadow-[var(--shadow-gold-glow)]"
                  : "border-border shadow-[var(--shadow-card)]"
              )}
            >
              <span
                className={cn(
                  "absolute -left-[3.55rem] top-5 hidden size-11 items-center justify-center rounded-full border sm:flex",
                  latest
                    ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                    : "border-border bg-card text-muted"
                )}
              >
                <Icon
                  aria-hidden={true}
                  className="size-5"
                />
              </span>

              <div className="flex items-start gap-4 sm:hidden">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border",
                    latest
                      ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                      : "border-border bg-background text-muted"
                  )}
                >
                  <Icon
                    aria-hidden={true}
                    className="size-4"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="font-medium text-foreground">
                    {event.title}
                  </h3>
                </div>
              </div>

              <h3 className="hidden font-medium text-foreground sm:block">
                {event.title}
              </h3>

              {event.description ? (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                  {event.description}
                </p>
              ) : null}

              <time className="mt-3 block text-xs text-muted">
                {formatDateTime(
                  event.createdAt
                )}
              </time>
            </article>
          );
        }
      )}
    </section>
  );
}
