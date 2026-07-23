import type { ReactNode } from "react";

import { AdminOrderCard } from "@/components/admin/AdminOrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Order } from "@/types/order";

export interface AdminOrderListItem {
  readonly order: Order;
  readonly customerName: string;
  readonly studioNames: readonly string[];
}

interface AdminOrderListProps {
  readonly items: readonly AdminOrderListItem[];
  readonly emptyAction?: ReactNode;
  readonly onView: (order: Order) => void;
}

export function AdminOrderList({
 emptyAction,
 items,
 onView,

}: AdminOrderListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No orders found"
        description="No orders match the selected search and status filters."
        action={emptyAction}
      />
    );
  }

 return (
   <div className="grid gap-4">
    {items.map(({ customerName, order, studioNames }) => (
      <AdminOrderCard
        key={order.id}
        order={order}
        customerName={customerName}
        studioNames={studioNames}
        onView={onView}
      />
    ))}
   </div>
 );
}
