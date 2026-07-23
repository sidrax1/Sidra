import { ReviewCard } from "@/components/account/ReviewCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProductReview } from "@/types/review";

interface ReviewListProps {
  readonly reviews: readonly ProductReview[];
}

export function ReviewList({
  reviews,
}: ReviewListProps): React.JSX.Element {
  if (reviews.length === 0) {
    return (
      <EmptyState
       title="No reviews submitted"
       description="Reviews you share after verified purchases will appear here."
      />
    );
  }

 return (
   <div className="grid gap-5">
    {reviews.map((review) => (
      <ReviewCard
        key={review.id}
        review={review}
      />
    ))}
   </div>
 );
}
