import type { ReactNode } from "react";

import { OrderCard } from "@/components/orders/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/types/order";

interface OrderListProps {
  readonly orders: readonly Order[];
  readonly emptyAction?: ReactNode;
  readonly getOrderHref?: (order: Order) => string;
}

export function OrderList({
  emptyAction,
  getOrderHref,
  orders,
}: OrderListProps): React.JSX.Element {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        description="Your collected pieces, protected payments and delivery progress will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Orders"
      className="grid gap-5"
    >
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          href={getOrderHref?.(order)}
        />
      ))}
    </section>
  );
}
