import Link from "next/link";
import {
  CalendarClock,
  ExternalLink,
  PackageCheck,
  Truck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  OrderShipment,
} from "@/types/order";

interface OrderShipmentCardProps {
  readonly shipment: OrderShipment;
  readonly className?: string;
}

export function OrderShipmentCard({
  className,
  shipment,
}: OrderShipmentCardProps): React.JSX.Element {
  const delivered =
    Boolean(shipment.deliveredAt);

  return (
    <Surface
      padding="none"
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="flex flex-col gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)]">
            {delivered ? (
              <PackageCheck
                aria-hidden="true"
                className="size-5"
              />
            ) : (
              <Truck
                aria-hidden="true"
                className="size-5"
              />
            )}
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
              Fulfilment
            </p>

            <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              Shipment Details
            </h2>
          </div>
        </div>

        <Badge
          variant={
            delivered
              ? "success"
              : "gold"
          }
        >
          {delivered
            ? "Delivered"
            : "In Transit"}
        </Badge>
      </header>

      <div className="grid gap-5 p-6">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Delivery Partner
            </dt>

            <dd className="mt-2 font-medium text-foreground">
              {shipment.carrier ??
                "Awaiting assignment"}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Tracking Number
            </dt>

            <dd className="mt-2 break-all font-mono text-sm font-medium text-foreground">
              {shipment.trackingNumber ??
                "Not available"}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Package Count
            </dt>

            <dd className="mt-2 font-medium text-foreground">
              {shipment.packageCount.toLocaleString(
                "en-IN"
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <CalendarClock
                aria-hidden="true"
                className="size-3.5"
              />
              Estimated Delivery
            </dt>

            <dd className="mt-2 font-medium text-foreground">
              {shipment.estimatedDeliveryDate
                ? formatDateTime(
                    shipment.estimatedDeliveryDate
                  )
                : "To be confirmed"}
            </dd>
          </div>
        </dl>

        {shipment.dispatchedAt ? (
          <p className="text-xs text-muted">
            Dispatched{" "}
            {formatDateTime(
              shipment.dispatchedAt
            )}
          </p>
        ) : null}

        {shipment.deliveredAt ? (
          <p className="text-xs font-medium text-[var(--color-success)]">
            Delivered{" "}
            {formatDateTime(
              shipment.deliveredAt
            )}
          </p>
        ) : null}

        {shipment.trackingURL ? (
          <div className="flex justify-end border-t border-border pt-5">
            <Button
              asChild
              variant="outline"
            >
              <Link
                href={
                  shipment.trackingURL
                }
                target="_blank"
                rel="noreferrer"
              >
                Track Shipment
                <ExternalLink
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </Surface>
  );
}
