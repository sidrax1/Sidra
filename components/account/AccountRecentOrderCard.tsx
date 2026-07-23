import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  PackageCheck,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";

export type AccountOrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface AccountRecentOrder {
  readonly id: string;
  readonly orderNumber: string;
  readonly studioName: string;
  readonly productTitle: string;
  readonly productImageURL?: string | null;
  readonly status: AccountOrderStatus;
  readonly totalPaise: number;
  readonly placedAt: string;
}

interface AccountRecentOrderCardProps {
  readonly order: AccountRecentOrder;
  readonly className?: string;
}

const statusLabels: Record<
  AccountOrderStatus,
  string
> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "In Preparation",
  shipped: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function AccountRecentOrderCard({
  className,
  order,
}: AccountRecentOrderCardProps): React.JSX.Element {
  const variant =
    order.status === "delivered"
      ? "success"
      : order.status === "cancelled" ||
          order.status === "refunded"
        ? "error"
        : order.status === "shipped"
          ? "gold"
          : "warning";

  return (
    <Link
      href={`/account/orders/${order.id}`}
      className={cn(
        "group grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5",
        "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)]",
        "hover:shadow-[var(--shadow-hover)] sm:grid-cols-[88px_minmax(0,1fr)_auto]",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-gray-100)]">
        {order.productImageURL ? (
          <Image
            src={order.productImageURL}
            alt={order.productTitle}
            fill
            sizes="88px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <PackageCheck
              aria-hidden={true}
              className="size-6 text-muted"
            />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={variant}>
            {statusLabels[order.status]}
          </Badge>

          <span className="text-xs text-muted">
            #{order.orderNumber}
          </span>
        </div>

        <h3 className="mt-3 line-clamp-1 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          {order.productTitle}
        </h3>

        <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
          <Store
            aria-hidden={true}
            className="size-3.5 text-[var(--color-gold-600)]"
          />
          {order.studioName}
        </p>

        <p className="mt-2 text-xs text-muted">
          Placed {formatDate(order.placedAt)}
        </p>
      </div>

      <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-end">
        <Price
          amount={order.totalPaise / 100}
          size="sm"
        />

        <ArrowUpRight
          aria-hidden={true}
          className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-gold-600)]"
        />
      </div>
    </Link>
  );
}
