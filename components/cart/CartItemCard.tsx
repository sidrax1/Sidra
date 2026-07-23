"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Trash2,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  Price,
} from "@/components/ui/Price";

import {
  QuantitySelector,
} from "@/components/ui/QuantitySelector";

import {
  PUBLIC_ROUTES,
} from "@/constants/routes";

import {
  cn,
} from "@/lib/utils";

import type {
  CartItem,
} from "@/types/cart";

export interface CartItemProductSnapshot {
  readonly title: string;
  readonly slug: string;
  readonly thumbnailURL: string;
  readonly variantLabel?: string;
  readonly availableQuantity: number;
  readonly active: boolean;
}

interface CartItemCardProps {
  readonly item: CartItem;
  readonly product: CartItemProductSnapshot;
  readonly loading?: boolean;
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

export function CartItemCard({
 className,
 item,
 loading = false,
 onMoveToWishlist,
 onQuantityChange,

  onRemove,
  product,
}: CartItemCardProps): React.JSX.Element {
  const unavailable =
   !product.active ||
   product.availableQuantity < 1;

 const maximumQuantity =
  Math.max(
    1,
    Math.min(
      product.availableQuantity,
      10
    )
  );

 return (
  <article
    className={cn(
      "grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-4",
      "shadow-[var(--shadow-card)] transition-[border-color,box-shadow]",
      "duration-[var(--duration-base)] hover:border-[color:rgb(200_169_106_/_0.35)]",
      "hover:shadow-[var(--shadow-hover)]",
      "sm:grid-cols-[140px_minmax(0,1fr)] sm:p-5",
      className
    )}
  >
    <Link
      href={PUBLIC_ROUTES.PRODUCT(
        product.slug
      )}
      className="relative aspect-square overflow-hidden rounded-md
bg-[var(--color-gray-100)]"
    >
      {product.thumbnailURL ? (
        <Image
         src={product.thumbnailURL}
         alt={product.title}
         fill
         sizes="(max-width: 640px) 100vw, 140px"
         className="object-cover transition-transform duration-[var(--duration-slow)]
hover:scale-[1.04]"
        />
      ):(

        <div className="flex size-full items-center justify-center
bg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-gold-100))] font-heading text-2xl
text-[var(--color-gold-600)]">
         Sidra
        </div>
      )}
    </Link>

    <div className="flex min-w-0 flex-col justify-between gap-5">
     <div className="flex items-start justify-between gap-4">
       <div className="min-w-0">
        <Link
         href={PUBLIC_ROUTES.PRODUCT(
           product.slug
         )}
         className="block"
        >
         <h3 className="line-clamp-2 font-heading text-2xl font-medium leading-tight
tracking-[-0.025em] text-foreground transition-colors hover:text-[var(--color-gold-600)]">
           {product.title}
         </h3>
        </Link>

       {product.variantLabel ? (
         <p className="mt-2 text-sm text-muted">
           {product.variantLabel}
         </p>
       ) : null}

       {unavailable ? (
         <p className="mt-2 text-sm font-medium text-[var(--color-error)]">
           This piece is currently unavailable.
         </p>
       ) : null}
      </div>

      <Price
       amount={
         item.price *
         item.quantity
       }
       size="md"
       className="shrink-0"
      />

</div>

<div className="flex flex-wrap items-center justify-between gap-4">
 <QuantitySelector
  value={item.quantity}
  minimum={1}
  maximum={maximumQuantity}
  disabled={
    loading ||
    unavailable
  }
  onChange={(quantity) => {
    void onQuantityChange(
      item,
      quantity
    );
  }}
 />

 <div className="flex items-center gap-1">
  {onMoveToWishlist ? (
    <IconButton
      label={`Move ${product.title} to wishlist`}
      icon={
        <Heart aria-hidden={true} />
      }
      appearance="ghost"
      disabled={loading}
      onClick={() => {
        void onMoveToWishlist(
          item
        );
      }}
    />
  ) : null}

  <IconButton
   label={`Remove ${product.title} from cart`}
   icon={
     <Trash2 aria-hidden={true} />
   }
   appearance="ghost"
   disabled={loading}
   className="text-[var(--color-error)]"

          onClick={() => {
            void onRemove(item);
          }}
         />
       </div>
     </div>
    </div>
   </article>
 );
}
