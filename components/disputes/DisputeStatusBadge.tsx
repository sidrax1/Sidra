import {
  CheckCircle2,
  Clock3,
  FileSearch,
  Handshake,
  Scale,
  ShieldAlert,
  Store,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  DisputeStatus,
} from "@/types/dispute";

interface DisputeStatusBadgeProps {
  readonly status: DisputeStatus;
}

const labels: Record<
  DisputeStatus,
  string
> = {
  submitted: "Submitted",
  underReview: "Under Review",
  evidenceRequired: "Evidence Required",
  merchantResponseRequired:
    "Studio Response Required",
  escalated: "Escalated",
  resolvedForCustomer:
    "Resolved for Customer",
  resolvedForStudio:
    "Resolved for Studio",
  partiallyResolved:
    "Partially Resolved",
  withdrawn: "Withdrawn",
  closed: "Closed",
};

export function DisputeStatusBadge({
  status,
}: DisputeStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "resolvedForCustomer"
      ? UserRoundCheck
      : status === "resolvedForStudio"
        ? Store
        : status === "partiallyResolved"
          ? Handshake
          : status === "closed"
            ? CheckCircle2
            : status === "withdrawn"
              ? XCircle
              : status === "underReview"
                ? FileSearch
                : status === "evidenceRequired"
                  ? ShieldAlert
                  : status ===
                      "merchantResponseRequired"
                    ? Store
                    : status === "escalated"
                      ? Scale
                      : Clock3;

  const variant =
    status === "resolvedForCustomer" ||
    status === "resolvedForStudio" ||
    status === "closed"
      ? "success"
      : status === "escalated"
        ? "error"
        : status === "evidenceRequired" ||
            status ===
              "merchantResponseRequired"
          ? "warning"
          : status === "withdrawn"
            ? "neutral"
            : "gold";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className="mr-1 size-3.5"
      />
      {labels[status]}
    </Badge>
  );
}
