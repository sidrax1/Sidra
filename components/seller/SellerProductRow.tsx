"use client";

import Image from "next/image";
import {
 Archive,

  Copy,
  Edit3,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { ProductStatusBadge, type SellerProductStatus } from
"@/components/seller/ProductStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import type { Product } from "@/types/product";

interface SellerProductRowProps {
  readonly product: Product;
  readonly status: SellerProductStatus;
  readonly loading?: boolean;
  readonly onView: (product: Product) => void;
  readonly onEdit: (product: Product) => void;
  readonly onDuplicate: (product: Product) => void | Promise<void>;
  readonly onArchive: (product: Product) => void | Promise<void>;
}

export function SellerProductRow({
  loading = false,
  onArchive,
  onDuplicate,
  onEdit,
  onView,
  product,
  status,
}: SellerProductRowProps): React.JSX.Element {
  const image = product.images.at(0);
  const sellingPrice =
    product.price.discountAmount ??
    product.price.finalAmount ??
    product.price.amount;

 return (
   <article className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-4
shadow-[var(--shadow-card)] transition-[border-color,box-shadow]
hover:border-[color:rgb(200_169_106_/_0.35)] hover:shadow-[var(--shadow-hover)]
md:grid-cols-[88px_minmax(0,1fr)_auto] md:items-center">
    <div className="relative aspect-square overflow-hidden rounded-md
bg-[var(--color-gray-100)]">
      {image ? (
        <Image
         src={image.url}
         alt={image.alt || product.title}
         fill
         sizes="88px"
         className="object-cover"
        />
      ):(
        <div className="flex size-full items-center justify-center font-heading text-xl
text-[var(--color-gold-600)]">
         Sidra
        </div>
      )}
    </div>

    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-3">
       <h3 className="truncate font-heading text-2xl font-medium tracking-[-0.025em]
text-foreground">
        {product.title}
       </h3>

     <ProductStatusBadge status={status} />
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
     <Price
      amount={sellingPrice}
      size="sm"
     />

      <span>
       Stock:{" "}
       <strong className="font-medium text-foreground">
        {product.inventory.toLocaleString("en-IN")}

   </strong>
  </span>

  <Rating
    value={product.rating}
    count={product.reviewCount}
  />
 </div>
</div>

<DropdownMenu>
 <DropdownMenuTrigger>
  <IconButton
   label={`Actions for ${product.title}`}
   icon={<MoreHorizontal aria-hidden={true} />}
   appearance="ghost"
   disabled={loading}
  />
 </DropdownMenuTrigger>

 <DropdownMenuContent>
  <DropdownMenuItem onSelect={() => onView(product)}>
   <Eye aria-hidden={true} className="size-4" />
   View Listing
  </DropdownMenuItem>

  <DropdownMenuItem onSelect={() => onEdit(product)}>
   <Edit3 aria-hidden={true} className="size-4" />
   Edit Product
  </DropdownMenuItem>

  <DropdownMenuItem
   onSelect={() => {
     void onDuplicate(product);
   }}
  >
   <Copy aria-hidden={true} className="size-4" />
   Duplicate
  </DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem
   destructive

         onSelect={() => {
           void onArchive(product);
         }}
       >
         <Archive aria-hidden={true} className="size-4" />
         Archive
       </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   </article>
 );
}
