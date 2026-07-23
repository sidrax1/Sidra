"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
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

import type {
  WishlistItem,
} from "@/types/wishlist";

interface WishlistCardProps {
  readonly item: WishlistItem;
  readonly product: Product;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onAddToCart: (
    product: Product
  ) => void | Promise<void>;

    readonly onRemove: (
      item: WishlistItem
    ) => void | Promise<void>;
}

export function WishlistCard({
  className,
  item,
  loading = false,
  onAddToCart,
  onRemove,
  product,
}: WishlistCardProps): React.JSX.Element {
  const image =
    product.images.at(0) ??
    null;

    const sellingPrice =
     product.price.discountAmount ??
     product.price.finalAmount ??
     product.price.amount;

    const compareAtPrice =
     product.price.amount >
     sellingPrice
      ? product.price.amount
      : undefined;

    const unavailable =
     !product.active ||
     product.inventory <= 0;

    return (
     <article
       className={cn(
         "group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
         "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
         "duration-[var(--duration-slow)] hover:-translate-y-1",
         "hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]",
         className
       )}
     >
       <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
         <Link

      href={PUBLIC_ROUTES.PRODUCT(
        product.slug
      )}
      className="absolute inset-0 z-10"
      aria-label={`View ${product.title}`}
     />

      {image ? (
        <Image
         src={image.url}
         alt={
           image.alt ||
           product.title
         }
         fill
         sizes="(max-width: 640px) 100vw, 33vw"
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

     <div className="absolute left-4 top-4 z-20">
      {unavailable ? (
        <Badge variant="neutral">
          Unavailable
        </Badge>
      ) : product.featured ? (
        <Badge variant="gold">
          Curated
        </Badge>
      ) : null}
     </div>

     <div className="absolute right-4 top-4 z-20">
      <IconButton
       label={`Remove ${product.title} from wishlist`}
       icon={
         <Trash2 aria-hidden="true" />

       }
       appearance="glass"
       disabled={loading}
       onClick={() => {
         void onRemove(item);
       }}
     />
    </div>
   </div>

    <div className="grid gap-4 p-5">
     <div>
       <Link
        href={PUBLIC_ROUTES.PRODUCT(
          product.slug
        )}
       >
        <h3 className="line-clamp-2 font-heading text-2xl font-medium leading-tight
tracking-[-0.025em] text-foreground">
          {product.title}
        </h3>
       </Link>

     <div className="mt-3">
      <Rating
        value={product.rating}
        count={
          product.reviewCount
        }
      />
     </div>
    </div>

    <Price
     amount={sellingPrice}
     compareAtAmount={
       compareAtPrice
     }
     size="md"
    />

    <Button
     fullWidth
     disabled={unavailable}

       loading={loading}
       loadingLabel="Adding"
       onClick={() => {
         void onAddToCart(
           product
         );
       }}
     >
       <ShoppingBag
         aria-hidden="true"
       />
       {unavailable
         ? "Unavailable"
         : "Move to Bag"}
     </Button>
    </div>
   </article>
 );
}
