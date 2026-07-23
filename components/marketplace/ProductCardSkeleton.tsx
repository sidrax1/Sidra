import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {

    readonly className?: string;
}

export function ProductCardSkeleton({
  className,
}: ProductCardSkeletonProps): React.JSX.Element {
  return (
   <Card
     aria-hidden={true}
     className={cn(
       "overflow-hidden",
       className
     )}
   >
     <Skeleton
       rounded="lg"
       className="aspect-square w-full rounded-none"
     />

      <div className="grid gap-4 p-5">
       <div className="grid gap-2">
        <Skeleton className="h-7 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
       </div>

       <Skeleton className="h-4 w-32" />

        <div className="flex items-center gap-3">
         <Skeleton className="h-6 w-24" />
         <Skeleton className="h-4 w-16" />
        </div>
       </div>
      </Card>
    );
}
