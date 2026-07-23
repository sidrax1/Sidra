"use client";

import {
  Heart,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Rating } from "@/components/ui/Rating";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { useState } from "react";

interface ProductDetailsProps {
  readonly product: Product;
  readonly studioName?: string;
  readonly wished?: boolean;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onAddToCart: (
    product: Product,
    quantity: number
  ) => void | Promise<void>;
  readonly onBuyNow?: (
    product: Product,
    quantity: number
  ) => void | Promise<void>;
  readonly onWishlistToggle?: (
    product: Product
  ) => void | Promise<void>;
}

function resolveSellingPrice(
  product: Product
): number {
  return (
    product.price.discountAmount ??
    product.price.finalAmount ??
    product.price.amount
  );
}

export function ProductDetails({
 className,
 loading = false,
 onAddToCart,
 onBuyNow,

  onWishlistToggle,
  product,
  studioName,
  wished = false,
}: ProductDetailsProps): React.JSX.Element {
  const [quantity, setQuantity] =
   useState(1);

 const sellingPrice =
  resolveSellingPrice(product);

 const compareAtAmount =
  product.price.amount >
  sellingPrice
   ? product.price.amount
   : undefined;

 const soldOut =
  product.inventory <= 0;

 return (
  <section
    className={cn(
      "grid content-start gap-6",
      className
    )}
  >
    <div>
      <div className="flex flex-wrap items-center gap-2">
       {product.featured ? (
         <Badge variant="gold">
           <Sparkles
            aria-hidden="true"
            className="mr-1 size-3.5"
           />
           Curated by Sidra
         </Badge>
       ) : null}

      {studioName ? (
        <Badge variant="neutral">
          {studioName}
        </Badge>
      ) : null}

    </div>

     <h1 className="mt-5 font-heading text-[clamp(2.6rem,5vw,4.8rem)] font-medium
leading-[0.95] tracking-[-0.05em] text-foreground">
      {product.title}
     </h1>

    <div className="mt-5">
     <Rating
       value={product.rating}
       count={product.reviewCount}
       size="md"
     />
    </div>
   </div>

   <Price
    amount={sellingPrice}
    compareAtAmount={
      compareAtAmount
    }
    size="xl"
   />

   <p className="text-base leading-8 text-muted">
    {product.description}
   </p>

   {product.tags.length > 0 ? (
     <div className="flex flex-wrap gap-2">
       {product.tags.map((tag) => (
         <Badge
           key={tag}
           variant="neutral"
         >
           {tag}
         </Badge>
       ))}
     </div>
   ) : null}

   <Separator />

   <div className="grid gap-5">

<div className="flex flex-wrap items-center justify-between gap-4">
 <div>
  <p className="text-sm font-medium text-foreground">
    Quantity
  </p>

  <p className="mt-1 text-xs text-muted">
   {soldOut
     ? "Currently unavailable"
     : `${product.inventory.toLocaleString("en-IN")} available`}
  </p>
 </div>

 <QuantitySelector
  value={quantity}
  minimum={1}
  maximum={Math.max(
    1,
    Math.min(
      product.inventory,
      10
    )
  )}
  disabled={
    soldOut ||
    loading
  }
  onChange={setQuantity}
 />
</div>

<div className="grid gap-3 sm:grid-cols-2">
 <Button
  size="lg"
  fullWidth
  disabled={soldOut}
  loading={loading}
  loadingLabel="Adding"
  onClick={() => {
    void onAddToCart(
      product,
      quantity
    );
  }}

 >
  <ShoppingBag
   aria-hidden="true"
  />
  {soldOut
   ? "Unavailable"
   : "Add to Bag"}
 </Button>

 <Button
  size="lg"
  fullWidth
  variant="outline"
  disabled={
    soldOut ||
    loading ||
    !onBuyNow
  }
  onClick={() => {
    void onBuyNow?.(
      product,
      quantity
    );
  }}
 >
  Buy Now
 </Button>
</div>

<Button
 fullWidth
 variant="ghost"
 disabled={
   loading ||
   !onWishlistToggle
 }
 onClick={() => {
   void onWishlistToggle?.(
     product
   );
 }}
>
 <Heart
   aria-hidden="true"

    className={cn(
      wished &&
       "fill-current text-[var(--color-error)]"
    )}
  />
  {wished
    ? "Saved to Wishlist"
    : "Save to Wishlist"}
 </Button>
</div>

<Separator />

<div className="grid gap-4 text-sm text-muted sm:grid-cols-3">
 <div className="flex items-start gap-3">
  <ShieldCheck
    aria-hidden="true"
    className="mt-0.5 size-5 shrink-0 text-[var(--color-gold-600)]"
  />

  <div>
   <p className="font-medium text-foreground">
     Verified Craft
   </p>
   <p className="mt-1 leading-5">
     Curated seller and quality review.
   </p>
  </div>
 </div>

 <div className="flex items-start gap-3">
  <Truck
   aria-hidden="true"
   className="mt-0.5 size-5 shrink-0 text-[var(--color-gold-600)]"
  />

  <div>
   <p className="font-medium text-foreground">
    Secure Delivery
   </p>
   <p className="mt-1 leading-5">
    Protected packaging and tracking.
   </p>
  </div>

      </div>

      <div className="flex items-start gap-3">
       <Sparkles
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-[var(--color-gold-600)]"
       />

       <div>
        <p className="font-medium text-foreground">
         Hand Finished
        </p>
        <p className="mt-1 leading-5">
         Crafted with individual attention.
        </p>
       </div>
     </div>
    </div>
   </section>
 );
}
