import {
  CheckCircle2,
  Clock3,
  FileSearch,
  Gavel,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  ReviewReportStatus,
} from "@/types/review-report";

interface ReviewReportStatusBadgeProps {
  readonly status: ReviewReportStatus;
}

const labels: Record<
  ReviewReportStatus,
  string
> = {
  submitted: "Submitted",
  underReview: "Under Review",
  actionRequired: "Action Required",
  resolved: "Resolved",
  dismissed: "Dismissed",
  escalated: "Escalated",
};

export function ReviewReportStatusBadge({
  status,
}: ReviewReportStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "resolved"
      ? CheckCircle2
      : status === "dismissed"
        ? XCircle
        : status === "underReview"
          ? FileSearch
          : status === "actionRequired"
            ? Gavel
            : status === "escalated"
              ? ShieldAlert
              : Clock3;

  const variant =
    status === "resolved"
      ? "success"
      : status === "dismissed"
        ? "neutral"
        : status === "escalated"
          ? "error"
          : status === "actionRequired"
            ? "warning"
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
