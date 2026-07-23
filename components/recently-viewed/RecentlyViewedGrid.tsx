import type {
  ReactNode,
} from "react";

import {
  RecentlyViewedItemCard,
  type RecentlyViewedItem,
} from "@/components/recently-viewed/RecentlyViewedItemCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface RecentlyViewedGridProps {
  readonly items: readonly RecentlyViewedItem[];
  readonly removingIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onRemove?: (
    item: RecentlyViewedItem
  ) => void | Promise<void>;
}

export function RecentlyViewedGrid({
  emptyAction,
  items,
  onRemove,
  removingIds,
}: RecentlyViewedGridProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No recently viewed pieces"
        description="Products you explore will appear here for convenient return access."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Recently viewed products"
      className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((item) => (
        <RecentlyViewedItemCard
          key={item.id}
          item={item}
          removing={
            removingIds?.has(
              item.id
            ) ?? false
          }
          onRemove={onRemove}
        />
      ))}
    </section>
  );
}
