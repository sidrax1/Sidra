import type { ReactNode } from "react";

import { SellerOrderCard } from "@/components/seller/SellerOrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/types/order";

interface SellerOrderListProps {
  readonly orders: readonly Order[];
  readonly loadingOrderIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (order: Order) => void;
  readonly onStartProcessing?: (order: Order) => void | Promise<void>;
  readonly onMarkShipped?: (order: Order) => void | Promise<void>;
}

export function SellerOrderList({
  emptyAction,
  loadingOrderIds,
  onMarkShipped,
  onStartProcessing,
  onView,
  orders,
}: SellerOrderListProps): React.JSX.Element {
  if (orders.length === 0) {
    return (
      <EmptyState
       title="No orders found"
       description="New customer orders will appear here with production and fulfilment controls."
       action={emptyAction}
      />
    );
  }

 return (
  <div className="grid gap-4">
    {orders.map((order) => (
     <SellerOrderCard
       key={order.id}

        order={order}
        loading={loadingOrderIds?.has(order.id) ?? false}
        onView={onView}
        onStartProcessing={onStartProcessing}
        onMarkShipped={onMarkShipped}
      />
    ))}
   </div>
 );
}
