import Image from "next/image";
import {
  BadgeCheck,
  ImageIcon,
  ThumbsUp,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/types/review";

interface ProductReviewCardProps {
  readonly review: ProductReview;
  readonly reviewerName: string;
  readonly reviewerPhotoURL?: string | null;
  readonly className?: string;
}

export function ProductReviewCard({
  className,
  review,
  reviewerName,
  reviewerPhotoURL,
}: ProductReviewCardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        "p-6 md:p-7",
        className
      )}
    >
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar
            name={reviewerName}
            src={reviewerPhotoURL}
            size="md"
          />

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-medium text-foreground">
                {reviewerName}
              </h3>

              {review.verifiedPurchase ? (
                <Badge variant="success">
                  <BadgeCheck
                    aria-hidden="true"
                    className="mr-1 size-3.5"
                  />
                  Verified Purchase
                </Badge>
              ) : null}
            </div>

            <time className="mt-2 block text-xs text-muted">
              {formatDate(
                review.createdAt
              )}
            </time>
          </div>
        </div>

        <Rating
          value={review.rating}
          showValue
        />
      </header>

      <div className="mt-6">
        <h4 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          {review.title}
        </h4>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
          {review.review}
        </p>
      </div>

      {review.images.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {review.images.map(
            (imageURL, index) => (
              <a
                key={`${imageURL}-${index}`}
                href={imageURL}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-gray-100)]"
              >
                <Image
                  src={imageURL}
                  alt={`Review image ${
                    index + 1
                  }`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
                />

                <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md">
                  <ImageIcon
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </span>
              </a>
            )
          )}
        </div>
      ) : null}

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <ThumbsUp
            aria-hidden="true"
            className="size-3.5"
          />

          {review.helpfulCount.toLocaleString(
            "en-IN"
          )}{" "}
          found this helpful
        </span>
      </footer>
    </Card>
  );
}
