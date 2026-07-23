import {
  CalendarDays,
  PackageCheck,
  Store,
} from "lucide-react";

import { OrderPaymentStatusBadge } from "@/components/orders/OrderPaymentStatusBadge";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderDetailHeaderProps {
  readonly order: Order;
  readonly className?: string;
}

export function OrderDetailHeader({
  className,
  order,
}: OrderDetailHeaderProps): React.JSX.Element {
  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border",
        "border-[color:rgb(200_169_106_/_0.28)] bg-card",
        "shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-9 text-white md:px-10 md:py-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 84% 10%, rgba(200,169,106,0.3), transparent 42%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <OrderPaymentStatusBadge status={order.paymentStatus} />
            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Protected Sydra Order
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em]">
              #{order.orderNumber}
            </h1>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Store
                  aria-hidden="true"
                  className="size-4"
                />
                {order.studioName}
              </span>

              <span className="inline-flex items-center gap-2">
                <CalendarDays
                  aria-hidden="true"
                  className="size-4"
                />
                {formatDateTime(order.placedAt)}
              </span>

              <span className="inline-flex items-center gap-2">
                <PackageCheck
                  aria-hidden="true"
                  className="size-4"
                />
                {order.itemCount.toLocaleString("en-IN")}{" "}
                {order.itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.16em] text-white/55">
              Order Total
            </p>

            <Price
              amount={order.pricing.totalPaise / 100}
              size="xl"
              className="mt-2 text-white"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
