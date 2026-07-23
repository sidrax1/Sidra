import type { ReactNode } from "react";

import { ProductModerationCard } from "@/components/admin/ProductModerationCard";
import type { ProductModerationStatus } from
"@/components/admin/ProductModerationStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types/product";

export interface ProductModerationListItem {
  readonly product: Product;
  readonly studioName: string;
  readonly status: ProductModerationStatus;
}

interface ProductModerationListProps {
  readonly items: readonly ProductModerationListItem[];
  readonly emptyAction?: ReactNode;
  readonly onReview: (product: Product) => void;
}

export function ProductModerationList({
  emptyAction,
  items,
  onReview,
}: ProductModerationListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Moderation queue is clear"
        description="Products awaiting approval will appear here."
        action={emptyAction}
      />

      );
 }

 return (
   <div className="grid gap-4">
    {items.map(({ product, status, studioName }) => (
      <ProductModerationCard
        key={product.id}
        product={product}
        studioName={studioName}
        status={status}
        onReview={onReview}
      />
    ))}
   </div>
 );
}
