import type { ReactNode } from "react";

import {
  InventoryRow,
  type SellerInventoryItem,
} from "@/components/seller/InventoryRow";
import { EmptyState } from "@/components/ui/EmptyState";

interface InventoryListProps {
  readonly items: readonly SellerInventoryItem[];
  readonly quantities: Readonly<Record<string, number>>;
  readonly loadingItemIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onQuantityChange: (
    item: SellerInventoryItem,
    quantity: number
  ) => void;
  readonly onSave: (
    item: SellerInventoryItem,
    quantity: number
  ) => void | Promise<void>;
}

export function InventoryList({
  emptyAction,
  items,
  loadingItemIds,
  onQuantityChange,
  onSave,
  quantities,
}: InventoryListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No inventory records"
        description="Inventory will appear after products are created with stock tracking enabled."
        action={emptyAction}
      />

      );
 }

 return (
  <div className="grid gap-4">
    {items.map((item) => {
      const quantity =
       quantities[item.id] ?? item.availableQuantity;

      return (
        <InventoryRow
         key={item.id}
         item={item}
         quantity={quantity}
         loading={loadingItemIds?.has(item.id) ?? false}
         onQuantityChange={(nextQuantity) =>
           onQuantityChange(item, nextQuantity)
         }
         onSave={() => onSave(item, quantity)}
        />
      );
    })}
   </div>
 );
}
