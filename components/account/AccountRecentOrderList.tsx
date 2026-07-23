import type {
  ReactNode,
} from "react";

import {
  AccountRecentOrderCard,
  type AccountRecentOrder,
} from "@/components/account/AccountRecentOrderCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface AccountRecentOrderListProps {
  readonly orders: readonly AccountRecentOrder[];
  readonly emptyAction?: ReactNode;
}

export function AccountRecentOrderList({
  emptyAction,
  orders,
}: AccountRecentOrderListProps): React.JSX.Element {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="Pieces you commission or collect through Sydra will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Recent orders"
      className="grid gap-4"
    >
      {orders.map((order) => (
        <AccountRecentOrderCard
          key={order.id}
          order={order}
        />
      ))}
    </section>
  );
}
