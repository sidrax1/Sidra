"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  ShoppingBag,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";

import {
  Button,
} from "@/components/ui/Button";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  Price,
} from "@/components/ui/Price";

import {
  Rating,
} from "@/components/ui/Rating";

import {
  PUBLIC_ROUTES,
} from "@/constants/routes";

import {
  cn,
} from "@/lib/utils";

import type {
  Product,
} from "@/types/product";

interface ProductListItemProps {
  readonly product: Product;
  readonly wished?: boolean;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onWishlistToggle?: (
    product: Product
  ) => void | Promise<void>;
  readonly onAddToCart?: (
    product: Product
  ) => void | Promise<void>;

}

export function ProductListItem({
  className,
  loading = false,
  onAddToCart,
  onWishlistToggle,
  product,
  wished = false,
}: ProductListItemProps): React.JSX.Element {
  const image =
    product.images.at(0) ??
    null;

    const sellingPrice =
     product.price.discountAmount ??
     product.price.finalAmount ??
     product.price.amount;

    const compareAtAmount =
     product.price.amount >
     sellingPrice
      ? product.price.amount
      : undefined;

    const unavailable =
     product.inventory <= 0;

    return (
     <article
       className={cn(
         "group grid overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
         "shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform]",
         "duration-[var(--duration-slow)] ease-[var(--ease-luxury)]",
         "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.42)]",
         "hover:shadow-[var(--shadow-hover)]",
         "sm:grid-cols-[220px_minmax(0,1fr)]",
         className
       )}
     >
       <Link
         href={PUBLIC_ROUTES.PRODUCT(
           product.slug
         )}

      className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]
sm:aspect-auto sm:min-h-56"
    >
      {image ? (
        <Image
         src={image.url}
         alt={
           image.alt ||
           product.title
         }
         fill
         sizes="(max-width: 640px) 100vw, 220px"
         className="object-cover transition-transform duration-[700ms]
group-hover:scale-[1.05]"
        />
      ):(
        <div className="flex size-full items-center justify-center
bg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-gold-100))] font-heading text-3xl
text-[var(--color-gold-600)]">
         Sidra
        </div>
      )}
    </Link>

   <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:p-6">
    <div className="min-w-0">
     <div className="flex flex-wrap items-center gap-2">
       {product.featured ? (
         <Badge variant="gold">
           Curated
         </Badge>
       ) : null}

       {unavailable ? (
         <Badge variant="neutral">
           Sold Out
         </Badge>
       ) : null}
      </div>

      <Link
       href={PUBLIC_ROUTES.PRODUCT(
         product.slug
       )}

       >
        <h3 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-[-0.03em]
text-foreground transition-colors group-hover:text-[var(--color-gold-600)]">
         {product.title}
        </h3>
       </Link>

      <p className="mt-3 line-clamp-3 max-w-2xl text-sm leading-7 text-muted">
       {product.description}
      </p>

     <div className="mt-4">
      <Rating
        value={
          product.rating
        }
        count={
          product.reviewCount
        }
      />
     </div>
    </div>

    <div className="flex flex-col justify-between gap-5 md:min-w-48 md:items-end">
     <Price
      amount={sellingPrice}
      compareAtAmount={
        compareAtAmount
      }
      size="lg"
      className="md:justify-end"
     />

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
       <IconButton
        label={
          wished
           ? "Remove from wishlist"
           : "Save to wishlist"
        }
        icon={
          <Heart
           aria-hidden="true"
           className={cn(

               wished &&
                "fill-current text-[var(--color-error)]"
             )}
            />
           }
           appearance="ghost"
           disabled={
             loading ||
             !onWishlistToggle
           }
           onClick={() => {
             void onWishlistToggle?.(
               product
             );
           }}
          />

            <Button
             disabled={
               unavailable ||
               loading ||
               !onAddToCart
             }
             loading={loading}
             loadingLabel="Adding"
             onClick={() => {
               void onAddToCart?.(
                 product
               );
             }}
            >
             <ShoppingBag
               aria-hidden="true"
             />
             {unavailable
               ? "Unavailable"
               : "Add to Bag"}
            </Button>
          </div>
        </div>
       </div>
      </article>
    );
}
