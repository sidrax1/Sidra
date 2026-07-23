import {
  Star,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";

interface ReviewRatingBadgeProps {
  readonly rating: number;
}

export function ReviewRatingBadge({
  rating,
}: ReviewRatingBadgeProps): React.JSX.Element {
  const variant =
    rating >= 4
      ? "success"
      : rating >= 3
        ? "gold"
        : rating >= 2
          ? "warning"
          : "error";

  return (
    <Badge variant={variant}>
      <Star
        aria-hidden={true}
        className="mr-1 size-3.5 fill-current"
      />
      {rating.toFixed(1)}
    </Badge>
  );
}
