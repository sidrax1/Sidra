"use client";

import {
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { Product } from "@/types/product";

interface WishlistCardProps {
  readonly product: Product;
  readonly loading?: boolean;
  readonly onRemove: (
    product: Product
  ) => void | Promise<void>;
  readonly onAddToCart: (
    product: Product
  ) => void | Promise<void>;
}

export function WishlistCard({
  loading = false,
  onAddToCart,
  onRemove,
  product,
}: WishlistCardProps): React.JSX.Element {
  return (
    <div className="grid gap-3">
     <ProductCard
      product={product}
      wished
      loading={loading}
      onWishlistToggle={
        onRemove
      }
      onAddToCart={
        onAddToCart
      }
     />

   <div className="grid grid-cols-2 gap-2">
    <Button
     variant="outline"
     size="sm"
     disabled={
       loading ||
       product.inventory <= 0
     }
     onClick={() => {
       void onAddToCart(
         product
       );
     }}

      >
       <ShoppingBag
        aria-hidden="true"
        className="size-4"
       />
       Add to Bag
      </Button>

     <Button
       variant="ghost"
       size="sm"
       disabled={loading}
       onClick={() => {
         void onRemove(product);
       }}
       className="text-[var(--color-error)]"
     >
       <Trash2
         aria-hidden="true"
         className="size-4"
       />
       Remove
     </Button>
    </div>
   </div>
 );
}
