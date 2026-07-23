import type { ReactNode } from "react";

import { ContentGrid } from "@/components/layout/ContentGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/marketplace/ProductCard";

import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  readonly products: readonly Product[];
  readonly wishedProductIds?: ReadonlySet<string>;
  readonly priorityProductCount?: number;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly emptyAction?: ReactNode;
  readonly className?: string;
  readonly onWishlistToggle?: (
    product: Product
  ) => void | Promise<void>;
  readonly onAddToCart?: (
    product: Product
  ) => void | Promise<void>;
}

export function ProductGrid({
  className,
  emptyAction,
  emptyDescription = "No pieces currently match this collection. Explore another curation orreturn shortly.",
  emptyTitle = "No pieces found",
  onAddToCart,
  onWishlistToggle,
  priorityProductCount = 4,
  products,
  wishedProductIds,
}: ProductGridProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <EmptyState
       title={emptyTitle}
       description={emptyDescription}
       action={emptyAction}
       className={className}
      />
    );
  }

 return (
  <ContentGrid

    columns={4}
    className={cn(
      "items-start",
      className
    )}
   >
    {products.map(
      (product, index) => (
        <ProductCard
         key={product.id}
         product={product}
         priority={
           index <
           priorityProductCount
         }
         wished={
           wishedProductIds?.has(
             product.id
           ) ?? false
         }
         onWishlistToggle={
           onWishlistToggle
         }
         onAddToCart={
           onAddToCart
         }
        />
      )
    )}
   </ContentGrid>
 );
}
