import type {
  ReactNode,
} from "react";

import {
  CartItemCard,
  type CartItemProductSnapshot,
} from "@/components/cart/CartItemCard";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

import {
  cn,
} from "@/lib/utils";

import type {
  CartItem,
} from "@/types/cart";

interface CartItemsListProps {
  readonly items: readonly CartItem[];
  readonly products: Readonly<
    Record<
      string,
      CartItemProductSnapshot
    >
  >;
  readonly loadingItemIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly className?: string;
  readonly onQuantityChange: (
    item: CartItem,
    quantity: number
  ) => void | Promise<void>;
  readonly onRemove: (
    item: CartItem
  ) => void | Promise<void>;
  readonly onMoveToWishlist?: (
    item: CartItem
  ) => void | Promise<void>;
}

export function CartItemsList({
 className,
 emptyAction,

  items,
  loadingItemIds,
  onMoveToWishlist,
  onQuantityChange,
  onRemove,
  products,
}: CartItemsListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your bag is awaiting something exceptional"
        description="Explore Sidra’s curated studios and add handcrafted pieces that deserve a
place in your collection."
        action={emptyAction}
        className={className}
      />
    );
  }

 return (
  <section
    aria-label="Shopping cart items"
    className={cn(
      "grid gap-4",
      className
    )}
  >
    {items.map((item) => {
      const product =
       products[item.productId];

     if (!product) {
       return null;
     }

     return (
      <CartItemCard
        key={item.id}
        item={item}
        product={product}
        loading={
          loadingItemIds?.has(
            item.id
          ) ?? false

         }
         onQuantityChange={
           onQuantityChange
         }
         onRemove={onRemove}
         onMoveToWishlist={
           onMoveToWishlist
         }
        />
      );
    })}
   </section>
 );
}
