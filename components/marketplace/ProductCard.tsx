"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  readonly product: Product;
  readonly wished?: boolean;
  readonly loading?: boolean;
  readonly priority?: boolean;
  readonly className?: string;
  readonly onWishlistToggle?: (
    product: Product
  ) => void | Promise<void>;
  readonly onAddToCart?: (
    product: Product
  ) => void | Promise<void>;

}

function resolvePrimaryImage(
  product: Product
): Product["images"][number] | null {
  return product.images.at(0) ?? null;
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

function resolveCompareAtPrice(
  product: Product
): number | undefined {
  const sellingPrice =
   resolveSellingPrice(product);

    return product.price.amount > sellingPrice
     ? product.price.amount
     : undefined;
}

export function ProductCard({
  className,
  loading = false,
  onAddToCart,
  onWishlistToggle,
  priority = false,
  product,
  wished = false,
}: ProductCardProps): React.JSX.Element {
  const primaryImage =
    resolvePrimaryImage(product);

    const sellingPrice =
     resolveSellingPrice(product);

 const compareAtPrice =
  resolveCompareAtPrice(product);

 const soldOut =
  product.inventory <= 0;

 return (
  <article
    className={cn(
      "group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
      "shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow]",
      "duration-[var(--duration-slow)] ease-[var(--ease-luxury)]",
      "hover:-translate-y-1 hover:border-[color:rgb(200_169_106_/_0.42)]",
      "hover:shadow-[var(--shadow-hover)]",
      className
    )}
  >
    <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
      <Link
       href={PUBLIC_ROUTES.PRODUCT(product.slug)}
       aria-label={`View ${product.title}`}
       className="absolute inset-0 z-10"
      />

      {primaryImage ? (
        <Image
         src={primaryImage.url}
         alt={primaryImage.alt || product.title}
         fill
         priority={priority}
         sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
         className="object-cover transition-transform duration-[700ms] ease-[var(--ease-luxury)]
group-hover:scale-[1.045]"
        />
      ):(
        <div className="flex size-full items-center justify-center
bg-[linear-gradient(135deg,var(--color-ivory-50),var(--color-gold-100))]">
         <span className="font-heading text-3xl text-[var(--color-gold-600)]">
           Sidra
         </span>
        </div>
      )}

     <div

       aria-hidden={true}
       className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20
via-transparent to-transparent opacity-0 transition-opacity duration-[var(--duration-slow)]
group-hover:opacity-100"
      />

     <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
      {product.featured ? (
        <Badge variant="gold">
          Curated
        </Badge>
      ) : null}

      {soldOut ? (
        <Badge variant="neutral">
          Sold Out
        </Badge>
      ) : null}
     </div>

     <div className="absolute right-4 top-4 z-20">
      <IconButton
       label={
         wished
           ? `Remove ${product.title} from wishlist`
           : `Add ${product.title} to wishlist`
       }
       icon={
         <Heart
           aria-hidden={true}
           className={cn(
             wished &&
              "fill-current"
           )}
         />
       }
       appearance="glass"
       disabled={loading}
       onClick={() => {
         void onWishlistToggle?.(
           product
         );
       }}
      />

     </div>

     <div className="absolute inset-x-4 bottom-4 z-20 translate-y-4 opacity-0
transition-[transform,opacity] duration-[var(--duration-base)] group-hover:translate-y-0
group-hover:opacity-100">
       <button
         type="button"
         disabled={
           soldOut ||
           loading ||
           !onAddToCart
         }
         onClick={() => {
           void onAddToCart?.(
             product
           );
         }}
         className={cn(
           "flex h-11 w-full items-center justify-center gap-2 rounded-full",
           "border border-[color:rgb(255_255_255_/_0.24)]",
           "bg-[color:rgb(17_17_17_/_0.78)] px-5",
           "text-sm font-medium text-white backdrop-blur-xl",
           "transition-[background-color,transform] duration-[var(--duration-base)]",
           "hover:bg-[var(--color-black-900)] active:scale-[0.985]",
           "disabled:pointer-events-none disabled:opacity-45"
         )}
       >
         <ShoppingBag
           aria-hidden={true}
           className="size-4"
         />

       {soldOut
        ? "Unavailable"
        : "Add to Bag"}
     </button>
    </div>
   </div>

   <div className="grid gap-3 p-5">
    <div className="min-w-0">
     <Link
       href={PUBLIC_ROUTES.PRODUCT(product.slug)}
       className="block"

       >
        <h3 className="line-clamp-2 font-heading text-2xl font-medium leading-tight
tracking-[-0.02em] text-foreground transition-colors group-hover:text-[var(--color-gold-600)]">
         {product.title}
        </h3>
       </Link>

       {product.tags.length > 0 ? (
         <p className="mt-1 truncate text-xs uppercase tracking-[0.14em] text-muted">
           {product.tags
            .slice(0, 3)
            .join(" · ")}
         </p>
       ) : null}
      </div>

      <Rating
       value={product.rating}
       count={product.reviewCount}
      />

     <Price
       amount={sellingPrice}
       compareAtAmount={
         compareAtPrice
       }
       size="md"
     />
    </div>
   </article>
 );
}
