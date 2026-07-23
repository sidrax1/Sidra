import type { ReactNode } from "react";

import { OrderCard } from "@/components/account/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/types/order";

interface OrderListProps {
  readonly orders: readonly Order[];
  readonly emptyAction?: ReactNode;
}

export function OrderList({
  emptyAction,
  orders,
}: OrderListProps): React.JSX.Element {
  if (orders.length === 0) {
    return (
      <EmptyState
       title="No orders yet"

      description="Your Sidra purchases will appear here with payment, production and delivery
updates."
      action={emptyAction}
     />
   );
 }

 return (
   <div className="grid gap-5">
    {orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
      />
    ))}
   </div>
 );
}
