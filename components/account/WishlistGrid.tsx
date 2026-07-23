import type { ReactNode } from "react";

import { WishlistCard } from "@/components/account/WishlistCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/types/product";

interface WishlistGridProps {
  readonly products: readonly Product[];
  readonly emptyAction?: ReactNode;

    readonly loading?: boolean;
    readonly onRemove: (
      product: Product
    ) => void | Promise<void>;
    readonly onAddToCart: (
      product: Product
    ) => void | Promise<void>;
}

export function WishlistGrid({
  emptyAction,
  loading = false,
  onAddToCart,
  onRemove,
  products,
}: WishlistGridProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <EmptyState
       title="Your wishlist is empty"
       description="Save exceptional pieces here and return when you are ready."
       action={emptyAction}
      />
    );
  }

    return (
      <ContentGrid columns={4}>
       {products.map((product) => (
         <WishlistCard
           key={product.id}
           product={product}
           loading={loading}
           onRemove={onRemove}
           onAddToCart={
             onAddToCart
           }
         />
       ))}
      </ContentGrid>
    );
}
