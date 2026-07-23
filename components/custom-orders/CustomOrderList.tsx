import type { ReactNode } from "react";

import { CustomOrderCard } from "@/components/custom-orders/CustomOrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderListProps {
  readonly customOrders: readonly CustomOrder[];
  readonly emptyAction?: ReactNode;
  readonly onView?: (customOrder: CustomOrder) => void;
}

export function CustomOrderList({
  customOrders,
  emptyAction,
  onView,
}: CustomOrderListProps): React.JSX.Element {
  if (customOrders.length === 0) {
    return (
      <EmptyState
        title="No custom commissions"
        description="Your personalised resin requests, studio quotations and production progress will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Custom order requests"
      className="grid gap-5"
    >
      {customOrders.map((customOrder) => (
        <CustomOrderCard
          key={customOrder.id}
          customOrder={customOrder}
          onView={onView}
        />
      ))}
    </section>
  );
}
