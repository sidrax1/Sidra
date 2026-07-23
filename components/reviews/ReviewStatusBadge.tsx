import { Badge } from "@/components/ui/Badge";
import type { ReviewStatus } from "@/types/review";

interface ReviewStatusBadgeProps {
  readonly status: ReviewStatus;
}

const labels: Record<
  ReviewStatus,
  string
> = {
  pending: "Pending Review",
  published: "Published",
  rejected: "Rejected",
  hidden: "Hidden",
};

export function ReviewStatusBadge({
  status,
}: ReviewStatusBadgeProps): React.JSX.Element {
  const variant =
    status === "published"
      ? "success"
      : status === "rejected"
        ? "error"
        : status === "pending"
          ? "warning"
          : "neutral";

  return (
    <Badge variant={variant}>
      {labels[status]}
    </Badge>
  );
}
