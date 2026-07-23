import type {
  ReactNode,
} from "react";

import {
  ContentGrid,
} from "@/components/layout/ContentGrid";

import {
  WishlistCard,
} from "@/components/wishlist/WishlistCard";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

import type {
 Product,

} from "@/types/product";

import type {
  WishlistItem,
} from "@/types/wishlist";

interface WishlistGridProps {
  readonly items: readonly WishlistItem[];
  readonly products: Readonly<
    Record<string, Product>
  >;
  readonly loadingItemIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onAddToCart: (
    product: Product
  ) => void | Promise<void>;
  readonly onRemove: (
    item: WishlistItem
  ) => void | Promise<void>;
}

export function WishlistGrid({
  emptyAction,
  items,
  loadingItemIds,
  onAddToCart,
  onRemove,
  products,
}: WishlistGridProps): React.JSX.Element {
  const resolvedItems =
    items.flatMap((item) => {
      const product =
       products[item.productId];

    return product
      ?[
          {
            item,
            product,
          },
        ]
      : [];
  });

 if (resolvedItems.length === 0) {
   return (
     <EmptyState
      title="Your private wishlist is empty"
      description="Save exceptional pieces while exploring Sidra and return when you are ready
to make them yours."
      action={emptyAction}
     />
   );
 }

 return (
   <ContentGrid columns={4}>
    {resolvedItems.map(
      ({
        item,
        product,
      }) => (
        <WishlistCard
          key={item.id}
          item={item}
          product={product}
          loading={
            loadingItemIds?.has(
              item.id
            ) ?? false
          }
          onAddToCart={
            onAddToCart
          }
          onRemove={onRemove}
        />
      )
    )}
   </ContentGrid>
 );
}
