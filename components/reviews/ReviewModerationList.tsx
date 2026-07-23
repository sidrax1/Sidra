import type {
  ReactNode,
} from "react";

import {
  type ModeratedReview,
  ReviewModerationCard,
} from "@/components/reviews/ReviewModerationCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";

interface ReviewModerationListProps {
  readonly reviews: readonly ModeratedReview[];
  readonly loadingReviewIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onPublish?: (
    review: ModeratedReview
  ) => void;
  readonly onHide?: (
    review: ModeratedReview
  ) => void;
  readonly onReview?: (
    review: ModeratedReview
  ) => void;
  readonly onReject?: (
    review: ModeratedReview
  ) => void;
  readonly onDelete?: (
    review: ModeratedReview
  ) => void;
}

export function ReviewModerationList({
  emptyAction,
  loadingReviewIds,
  onDelete,
  onHide,
  onPublish,
  onReject,
  onReview,
  reviews,
}: ReviewModerationListProps): React.JSX.Element {
  if (
    reviews.length === 0
  ) {
    return (
      <EmptyState
        title="No reviews require moderation"
        description="Flagged, pending and reported reviews will appear here."
        action={emptyAction}
      />
    );
  }

  return (
    <section
      aria-label="Review moderation queue"
      className="grid gap-5 xl:grid-cols-2"
    >
      {reviews.map(
        (review) => (
          <ReviewModerationCard
            key={review.id}
            review={review}
            loading={
              loadingReviewIds?.has(
                review.id
              ) ?? false
            }
            onPublish={
              onPublish
            }
            onHide={onHide}
            onReview={onReview}
            onReject={onReject}
            onDelete={onDelete}
          />
        )
      )}
    </section>
  );
}
