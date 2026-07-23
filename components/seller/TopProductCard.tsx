import Image from "next/image";
import {
  Eye,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";

export interface TopProductMetric {
  readonly id: string;
  readonly title: string;
  readonly thumbnailURL?: string;
  readonly views: number;
  readonly orders: number;
  readonly revenue: number;
  readonly conversionRate: number;
}

interface TopProductCardProps {
  readonly product: TopProductMetric;
  readonly rank: number;
}

export function TopProductCard({
  product,
  rank,
}: TopProductCardProps): React.JSX.Element {
  return (
   <Card className="p-5">
     <div className="grid gap-5 sm:grid-cols-[92px_minmax(0,1fr)]">
      <div className="relative aspect-square overflow-hidden rounded-md
bg-[var(--color-gray-100)]">
       {product.thumbnailURL ? (
         <Image
           src={product.thumbnailURL}
           alt={product.title}
           fill

          sizes="92px"
          className="object-cover"
         />
       ):(
         <div className="flex size-full items-center justify-center font-heading text-2xl
text-[var(--color-gold-600)]">
          {rank}
         </div>
       )}

     <span className="absolute left-2 top-2 flex size-7 items-center justify-center
rounded-full bg-black/70 text-xs font-semibold text-white backdrop-blur-md">
      {rank}
     </span>
    </div>

     <div className="min-w-0">
      <h3 className="truncate font-heading text-2xl font-medium tracking-[-0.025em]">
       {product.title}
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
       <div>
        <p className="inline-flex items-center gap-2 text-muted">
          <Eye aria-hidden="true" className="size-4" />
          Views
        </p>
        <p className="mt-1 font-medium text-foreground">
          {product.views.toLocaleString("en-IN")}
        </p>
       </div>

       <div>
        <p className="inline-flex items-center gap-2 text-muted">
         <ShoppingBag aria-hidden="true" className="size-4" />
         Orders
        </p>
        <p className="mt-1 font-medium text-foreground">
         {product.orders.toLocaleString("en-IN")}
        </p>
       </div>

       <div>
        <p className="inline-flex items-center gap-2 text-muted">

         <TrendingUp aria-hidden="true" className="size-4" />
         Conversion
        </p>
        <p className="mt-1 font-medium text-foreground">
         {product.conversionRate.toFixed(1)}%
        </p>
       </div>

        <div>
         <p className="text-muted">Revenue</p>
         <Price
           amount={product.revenue}
           size="sm"
           className="mt-1"
         />
        </div>
      </div>
     </div>
    </div>
   </Card>
 );
}
