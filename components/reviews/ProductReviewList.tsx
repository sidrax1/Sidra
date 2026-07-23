import type { ReactNode } from "react";

import { ProductReviewCard } from "@/components/reviews/ProductReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProductReview } from "@/types/review";

export interface ProductReviewListItem {
  readonly review: ProductReview;
  readonly reviewerName: string;
  readonly reviewerPhotoURL?: string | null;
}

interface ProductReviewListProps {
  readonly items: readonly ProductReviewListItem[];
  readonly emptyAction?: ReactNode;
}

export function ProductReviewList({
  emptyAction,
  items,
}: ProductReviewListProps): React.JSX.Element {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No verified reviews yet"
        description="Collector experiences will appear here after completed purchases."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Product reviews"
      className="grid gap-5"
    >
      {items.map((item) => (
        <ProductReviewCard
          key={item.review.id}
          review={item.review}
          reviewerName={
            item.reviewerName
          }
          reviewerPhotoURL={
            item.reviewerPhotoURL
          }
        />
      ))}
    </section>
  );
}
