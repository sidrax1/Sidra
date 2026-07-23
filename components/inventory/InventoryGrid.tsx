import type { ReactNode } from "react";

import { InventoryCard } from "@/components/inventory/InventoryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { InventoryRecord } from "@/types/inventory";

export interface InventoryGridItem {
  readonly inventory: InventoryRecord;
  readonly productTitle: string;
}

interface InventoryGridProps {
  readonly items: readonly InventoryGridItem[];
  readonly emptyAction?: ReactNode;
}

export function InventoryGrid({
  emptyAction,
  items,
}: InventoryGridProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No inventory records"
        description="Tracked product inventory will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Inventory records"
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {items.map((item) => (
        <InventoryCard
          key={item.inventory.id}
          inventory={item.inventory}
          productTitle={item.productTitle}
        />
      ))}
    </section>
  );
}
