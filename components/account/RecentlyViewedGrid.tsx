import type { ReactNode } from "react";

import { ProductGrid } from "@/components/marketplace/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types/product";

interface RecentlyViewedGridProps {
  readonly products: readonly Product[];
  readonly emptyAction?: ReactNode;
  readonly onWishlistToggle?: (
    product: Product
  ) => void | Promise<void>;
  readonly onAddToCart?: (
    product: Product
  ) => void | Promise<void>;
}

export function RecentlyViewedGrid({
 emptyAction,

  onAddToCart,
  onWishlistToggle,
  products,
}: RecentlyViewedGridProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <EmptyState
       title="No recent pieces"
       description="Products you explore will appear here for easy return."
       action={emptyAction}
      />
    );
  }

 return (
   <ProductGrid
    products={products}
    onWishlistToggle={
      onWishlistToggle
    }
    onAddToCart={
      onAddToCart
    }
   />
 );
}
