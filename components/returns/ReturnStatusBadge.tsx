import {
  Ban,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileSearch,
  PackageCheck,
  PackageSearch,
  RefreshCcw,
  Replace,
  RotateCcw,
  ShieldAlert,
  Truck,
  XCircle,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ReturnStatus,
} from "@/types/return";

interface ReturnStatusBadgeProps {
  readonly status: ReturnStatus;
}

const statusLabels: Record<
  ReturnStatus,
  string
> = {
  requested: "Requested",
  underReview: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  pickupScheduled: "Pickup Scheduled",
  inTransit: "In Transit",
  received: "Received",
  inspectionInProgress:
    "Inspection in Progress",
  inspectionPassed:
    "Inspection Passed",
  inspectionFailed:
    "Inspection Failed",
  refundInitiated:
    "Refund Initiated",
  replacementInitiated:
    "Replacement Initiated",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ReturnStatusBadge({
  status,
}: ReturnStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "requested"
      ? Clock3
      : status ===
          "underReview"
        ? FileSearch
        : status ===
            "approved"
          ? FileCheck2
          : status ===
              "rejected"
            ? XCircle
            : status ===
                "pickupScheduled"
              ? Truck
              : status ===
                  "inTransit"
                ? PackageSearch
                : status ===
                    "received"
                  ? PackageCheck
                  : status ===
                      "inspectionInProgress"
                    ? RefreshCcw
                    : status ===
                        "inspectionPassed"
                      ? CheckCircle2
                      : status ===
                          "inspectionFailed"
                        ? ShieldAlert
                        : status ===
                            "refundInitiated"
                          ? RotateCcw
                          : status ===
                              "replacementInitiated"
                            ? Replace
                            : status ===
                                "completed"
                              ? CheckCircle2
                              : Ban;

  const variant =
    status === "completed" ||
    status ===
      "inspectionPassed"
      ? "success"
      : status ===
          "approved" ||
        status ===
          "refundInitiated" ||
        status ===
          "replacementInitiated"
        ? "gold"
        : status ===
            "rejected" ||
          status ===
            "inspectionFailed" ||
          status ===
            "cancelled"
          ? "error"
          : status ===
              "pickupScheduled" ||
            status ===
              "inTransit" ||
            status ===
              "inspectionInProgress"
            ? "warning"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className={[
          "mr-1 size-3.5",
          status ===
          "inspectionInProgress"
            ? "animate-spin"
            : "",
        ].join(" ")}
      />
      {statusLabels[status]}
    </Badge>
  );
}
