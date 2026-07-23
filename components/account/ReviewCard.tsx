import Image from "next/image";
import {
  BadgeCheck,

  ThumbsUp,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Rating } from "@/components/ui/Rating";
import { formatDate } from "@/lib/date";
import type { ProductReview } from "@/types/review";

interface ReviewCardProps {
  readonly review: ProductReview;
}

export function ReviewCard({
  review,
}: ReviewCardProps): React.JSX.Element {
  return (
   <Card className="p-6">
     <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
       <Rating
         value={review.rating}
         showValue={false}
       />

      <h3 className="mt-3 font-heading text-2xl font-medium text-foreground">
       {review.title}
      </h3>
     </div>

     {review.verifiedPurchase ? (
       <Badge variant="success">
         <BadgeCheck
          aria-hidden={true}
          className="mr-1 size-3.5"
         />
         Verified Purchase
       </Badge>
     ) : null}
    </div>

    <p className="mt-4 text-sm leading-7 text-muted">
     {review.review}
    </p>

      {review.images.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {review.images.map(
            (imageURL, index) => (
              <div
               key={imageURL}
               className="relative size-20 overflow-hidden rounded-md border border-border"
              >
               <Image
                src={imageURL}
                alt={`Review image ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
               />
              </div>
            )
          )}
        </div>
      ) : null}

   <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t
border-border pt-4 text-xs text-muted">
    <time>
      {formatDate(
        review.createdAt
      )}
    </time>

        <span className="inline-flex items-center gap-2">
          <ThumbsUp
            aria-hidden={true}
            className="size-3.5"
          />
          {review.helpfulCount.toLocaleString(
            "en-IN"
          )}{" "}
          helpful
        </span>
       </footer>
      </Card>
    );
}
