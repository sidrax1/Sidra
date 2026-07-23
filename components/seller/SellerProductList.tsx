import type { ReactNode } from "react";

import { SellerProductRow } from "@/components/seller/SellerProductRow";
import type { SellerProductStatus } from "@/components/seller/ProductStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types/product";

export interface SellerProductListItem {
  readonly product: Product;
  readonly status: SellerProductStatus;
}

interface SellerProductListProps {
  readonly items: readonly SellerProductListItem[];
  readonly loadingProductIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (product: Product) => void;
  readonly onEdit: (product: Product) => void;
  readonly onDuplicate: (product: Product) => void | Promise<void>;
  readonly onArchive: (product: Product) => void | Promise<void>;
}

export function SellerProductList({
 emptyAction,
 items,

  loadingProductIds,
  onArchive,
  onDuplicate,
  onEdit,
  onView,
}: SellerProductListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Create your first product or refine the current filters."
        action={emptyAction}
      />
    );
  }

 return (
   <div className="grid gap-4">
    {items.map(({ product, status }) => (
      <SellerProductRow
        key={product.id}
        product={product}
        status={status}
        loading={loadingProductIds?.has(product.id) ?? false}
        onView={onView}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onArchive={onArchive}
      />
    ))}
   </div>
 );
}
