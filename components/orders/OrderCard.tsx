import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Package,
  Store,
} from "lucide-react";

import { OrderPaymentStatusBadge } from "@/components/orders/OrderPaymentStatusBadge";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderCardProps {
  readonly order: Order;
  readonly className?: string;
  readonly href?: string;
}

export function OrderCard({
  className,
  href,
  order,
}: OrderCardProps): React.JSX.Element {
  const primaryItem = order.items.at(0);
  const additionalItemCount = Math.max(order.items.length - 1, 0);
  const detailsHref = href ?? `/account/orders/${order.id}`;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-[transform,border-color,box-shadow]",
        "duration-[var(--duration-base)] hover:-translate-y-0.5",
        "hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="grid gap-6 p-5 md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-start md:p-6">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-gray-100)]">
          {primaryItem?.product.imageURL ? (
            <Image
              src={primaryItem.product.imageURL}
              alt={primaryItem.product.title}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Package
                aria-hidden="true"
                className="size-7 text-muted"
              />
            </div>
          )}

          {additionalItemCount > 0 ? (
            <span className="absolute bottom-2 right-2 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-xl">
              +{additionalItemCount}
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <OrderPaymentStatusBadge status={order.paymentStatus} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              Order #{order.orderNumber}
            </h2>

            <span className="text-xs text-muted">
              {order.itemCount.toLocaleString("en-IN")}{" "}
              {order.itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <p className="mt-3 line-clamp-1 text-sm font-medium text-foreground">
            {primaryItem?.product.title ?? "Sydra order"}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Store
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              {order.studioName}
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Placed {formatDate(order.placedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <Price
            amount={order.pricing.totalPaise / 100}
            size="lg"
          />

          <Button asChild variant="outline" size="sm">
            <Link href={detailsHref}>
              View Order
              <ArrowUpRight
                aria-hidden="true"
                className="size-4"
              />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
