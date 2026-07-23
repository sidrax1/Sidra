import {
  BadgeCheck,
  Flag,
  Star,
} from "lucide-react";

import { ReviewStatusBadge } from "@/components/reviews/ReviewStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { formatDateTime } from "@/lib/date";
import type { ProductReview } from "@/types/review";

interface ReviewDetailHeaderProps {
  readonly review: ProductReview;
  readonly productTitle: string;
  readonly reviewerName: string;
}

export function ReviewDetailHeader({
  productTitle,
  review,
  reviewerName,
}: ReviewDetailHeaderProps): React.JSX.Element {
  return (
    <header className="overflow-hidden rounded-[var(--radius-xl)] border border-[color:rgb(200_169_106_/_0.3)] bg-card shadow-[var(--shadow-hover)]">
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-9 text-white md:px-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 0%, rgba(200,169,106,0.28), transparent 42%)",
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <ReviewStatusBadge
              status={review.status}
            />

            {review.verifiedPurchase ? (
              <Badge variant="success">
                <BadgeCheck
                  aria-hidden={true}
                  className="mr-1 size-3.5"
                />
                Verified Purchase
              </Badge>
            ) : null}

            {review.reportCount > 0 ? (
              <Badge variant="warning">
                <Flag
                  aria-hidden={true}
                  className="mr-1 size-3.5"
                />
                {review.reportCount.toLocaleString(
                  "en-IN"
                )}{" "}
                reports
              </Badge>
            ) : null}
          </div>

          <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.5rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.055em]">
            {review.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-white/65">
            <span>
              By {reviewerName}
            </span>

            <span>
              {productTitle}
            </span>

            <time>
              {formatDateTime(
                review.createdAt
              )}
            </time>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-10">
        <Rating
          value={review.rating}
          showValue
        />

        <span className="inline-flex items-center gap-2 text-sm text-muted">
          <Star
            aria-hidden={true}
            className="size-4 fill-[var(--color-gold-500)] text-[var(--color-gold-500)]"
          />
          {review.helpfulCount.toLocaleString(
            "en-IN"
          )}{" "}
          helpful votes
        </span>
      </div>
    </header>
  );
}
