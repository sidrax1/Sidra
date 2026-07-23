import {
  ContentGrid,
} from "@/components/layout/ContentGrid";

import {
  ProductCardSkeleton,
} from "@/components/marketplace/ProductCardSkeleton";

import {
  Skeleton,
} from "@/components/ui/Skeleton";

import {
  cn,
} from "@/lib/utils";

interface MarketplaceResultsSkeletonProps {
  readonly itemCount?: number;
  readonly className?: string;
}

export function MarketplaceResultsSkeleton({
  className,
  itemCount = 8,
}: MarketplaceResultsSkeletonProps): React.JSX.Element {
  return (
    <section
     aria-label="Loading products"
     aria-busy="true"
     className={cn(
       "grid gap-6",
       className
     )}
    >
     <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border
py-4">
       <Skeleton className="h-5 w-32" />

     <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-52 rounded-full" />

        <Skeleton className="hidden size-11 rounded-full sm:block" />
        <Skeleton className="hidden size-11 rounded-full sm:block" />
       </div>
      </div>

    <ContentGrid columns={4}>
     {Array.from(
       {
         length: itemCount,
       },
       (_, index) => (
         <ProductCardSkeleton
           key={index}
         />
       )
     )}
    </ContentGrid>
   </section>
 );
}
