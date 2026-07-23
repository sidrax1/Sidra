import { TopProductCard, type TopProductMetric } from "@/components/seller/TopProductCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface TopProductListProps {
  readonly products: readonly TopProductMetric[];
}

export function TopProductList({
  products,
}: TopProductListProps): React.JSX.Element {
  if (products.length === 0) {
    return (
      <EmptyState
       title="No product performance yet"

       description="Top-selling and most-viewed products will appear after your studio receives
traffic."
      />
    );
  }

 return (
   <div className="grid gap-4 lg:grid-cols-2">
    {products.map((product, index) => (
      <TopProductCard
        key={product.id}
        product={product}
        rank={index + 1}
      />
    ))}
   </div>
 );
}
