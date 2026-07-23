import {
  Ban,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  RefundStatus,
} from "@/types/refund";

interface RefundStatusBadgeProps {
  readonly status: RefundStatus;
}

const labels: Record<
  RefundStatus,
  string
> = {
  pending: "Pending",
  approved: "Approved",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function RefundStatusBadge({
  status,
}: RefundStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "completed"
      ? CheckCircle2
      : status === "approved"
        ? ShieldCheck
        : status === "processing"
          ? LoaderCircle
          : status === "failed"
            ? XCircle
            : status === "cancelled"
              ? Ban
              : Clock3;

  const variant =
    status === "completed"
      ? "success"
      : status === "approved"
        ? "gold"
        : status === "processing"
          ? "warning"
          : status === "failed" ||
              status === "cancelled"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      {status === "processing" ? (
        <RefreshCcw
          aria-hidden="true"
          className="mr-1 size-3.5 animate-spin"
        />
      ) : (
        <Icon
          aria-hidden="true"
          className="mr-1 size-3.5"
        />
      )}
      {labels[status]}
    </Badge>
  );
}
