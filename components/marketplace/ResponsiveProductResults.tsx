"use client";

import type {
  ReactNode,
} from "react";

import {
  ProductGrid,
} from "@/components/marketplace/ProductGrid";

import {
  ProductListItem,
} from "@/components/marketplace/ProductListItem";

import type {
  MarketplaceViewMode,
} from "@/components/marketplace/MarketplaceToolbar";

import {
  EmptyState,
} from "@/components/ui/EmptyState";

import {
  cn,
} from "@/lib/utils";

import type {
  Product,
} from "@/types/product";

interface ResponsiveProductResultsProps {
  readonly products: readonly Product[];
  readonly viewMode: MarketplaceViewMode;
  readonly wishedProductIds?: ReadonlySet<string>;
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

export function ResponsiveProductResults({
  className,
  emptyAction,
  emptyDescription = "No pieces match the current selection.",
  emptyTitle = "No pieces found",
  onAddToCart,
  onWishlistToggle,
  products,
  viewMode,
  wishedProductIds,
}: ResponsiveProductResultsProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <EmptyState
       title={emptyTitle}
       description={
         emptyDescription
       }
       action={emptyAction}
       className={className}
      />
    );
  }

    if (viewMode === "list") {
      return (
        <div
         className={cn(
           "grid gap-5",
           className
         )}
        >
         {products.map(
           (product) => (
            <ProductListItem

            key={product.id}
            product={product}
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
        </div>
      );
 }

 return (
   <ProductGrid
    products={products}
    wishedProductIds={
      wishedProductIds
    }
    emptyTitle={emptyTitle}
    emptyDescription={
      emptyDescription
    }
    emptyAction={emptyAction}
    onWishlistToggle={
      onWishlistToggle
    }
    onAddToCart={
      onAddToCart
    }
    className={className}
   />
 );
}
