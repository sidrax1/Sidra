import {
  OrderItemCard,
} from "@/components/orders/OrderItemCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  OrderItem,
} from "@/types/order";

interface OrderItemListProps {
  readonly items: readonly OrderItem[];
  readonly showProductLinks?: boolean;
}

export function OrderItemList({
  items,
  showProductLinks = true,
}: OrderItemListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No order items"
        description="The products associated with this order could not be found."
      />
    );
  }

  return (
    <section
      aria-label="Order items"
      className="grid gap-4"
    >
      {items.map((item) => (
        <OrderItemCard
          key={item.id}
          item={item}
          showProductLink={
            showProductLinks
          }
        />
      ))}
    </section>
  );
}
