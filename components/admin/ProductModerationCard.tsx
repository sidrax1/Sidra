"use client";

import Image from "next/image";
import {
  ArrowRight,
  PackageCheck,
  Store,
} from "lucide-react";

import type {
  ProductModerationStatus} from "@/components/admin/ProductModerationStatusBadge";
import {
  ProductModerationStatusBadge,
} from "@/components/admin/ProductModerationStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import type { Product } from "@/types/product";

interface ProductModerationCardProps {
  readonly product: Product;
  readonly studioName: string;
  readonly status: ProductModerationStatus;
  readonly onReview: (product: Product) => void;
}

export function ProductModerationCard({
  onReview,
  product,
  status,
  studioName,
}: ProductModerationCardProps): React.JSX.Element {
  const image = product.images.at(0);

 const sellingPrice =
  product.price.discountAmount ??
  product.price.finalAmount ??
  product.price.amount;

 return (
  <Card className="grid gap-5 p-5 md:grid-cols-[110px_minmax(0,1fr)_auto]
md:items-center">
    <div className="relative aspect-square overflow-hidden rounded-md
bg-[var(--color-gray-100)]">
     {image ? (
       <Image
        src={image.url}
        alt={image.alt || product.title}
        fill
        sizes="110px"
        className="object-cover"
       />

 ):(
   <div className="flex size-full items-center justify-center">
    <PackageCheck
     aria-hidden="true"
     className="size-6 text-muted"
    />
   </div>
 )}
</div>

<div className="min-w-0">
 <div className="flex flex-wrap items-center gap-3">
  <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
    {product.title}
  </h3>

  <ProductModerationStatusBadge status={status} />
 </div>

 <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
  <Store aria-hidden="true" className="size-4" />
  {studioName}
 </p>

 <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
  <Price amount={sellingPrice} size="sm" />

  <Rating
   value={product.rating}
   count={product.reviewCount}
  />

  <span className="text-xs text-muted">
    {product.inventory.toLocaleString("en-IN")} in stock
  </span>
 </div>
</div>

<Button
 variant="outline"
 className="shrink-0"
 onClick={() => onReview(product)}
>
 Review Product

     <ArrowRight aria-hidden="true" className="size-4" />
    </Button>
   </Card>
 );
}
