import {
  CheckCircle2,
  Clock3,
  EyeOff,
  Flag,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";

export type ReviewModerationStatus =
  | "pending"
  | "published"
  | "flagged"
  | "hidden"
  | "rejected"
  | "underReview";

interface ReviewModerationStatusBadgeProps {
  readonly status: ReviewModerationStatus;
}

const labels: Record<
  ReviewModerationStatus,
  string
> = {
  pending: "Pending",
  published: "Published",
  flagged: "Flagged",
  hidden: "Hidden",
  rejected: "Rejected",
  underReview: "Under Review",
};

export function ReviewModerationStatusBadge({
  status,
}: ReviewModerationStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "published"
      ? CheckCircle2
      : status ===
          "flagged"
        ? Flag
        : status === "hidden"
          ? EyeOff
          : status ===
              "rejected"
            ? XCircle
            : status ===
                "underReview"
              ? ShieldAlert
              : Clock3;

  const variant =
    status === "published"
      ? "success"
      : status ===
          "rejected"
        ? "error"
        : status ===
            "flagged" ||
          status ===
            "underReview"
          ? "warning"
          : status ===
              "hidden"
            ? "neutral"
            : "gold";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[status]}
    </Badge>
  );
}
