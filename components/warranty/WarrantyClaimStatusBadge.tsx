import {
  Ban,
  CheckCircle2,
  Clock3,
  FileSearch,
  FileWarning,
  PackageCheck,
  RefreshCcw,
  Replace,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  WarrantyClaimStatus,
} from "@/types/warranty";

interface WarrantyClaimStatusBadgeProps {
  readonly status: WarrantyClaimStatus;
}

const labels: Record<
  WarrantyClaimStatus,
  string
> = {
  submitted: "Submitted",
  underReview: "Under Review",
  evidenceRequired:
    "Evidence Required",
  approved: "Approved",
  rejected: "Rejected",
  repairScheduled:
    "Repair Scheduled",
  replacementApproved:
    "Replacement Approved",
  refundApproved:
    "Refund Approved",
  inService: "In Service",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function WarrantyClaimStatusBadge({
  status,
}: WarrantyClaimStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "submitted"
      ? Clock3
      : status ===
          "underReview"
        ? FileSearch
        : status ===
            "evidenceRequired"
          ? FileWarning
          : status ===
              "approved"
            ? ShieldCheck
            : status ===
                "rejected"
              ? XCircle
              : status ===
                  "repairScheduled"
                ? Wrench
                : status ===
                    "replacementApproved"
                  ? Replace
                  : status ===
                      "refundApproved"
                    ? RefreshCcw
                    : status ===
                        "inService"
                      ? ShieldAlert
                      : status ===
                          "completed"
                        ? CheckCircle2
                        : Ban;

  const variant =
    status === "completed" ||
    status === "approved"
      ? "success"
      : status ===
          "repairScheduled" ||
        status ===
          "replacementApproved" ||
        status ===
          "refundApproved"
        ? "gold"
        : status ===
            "evidenceRequired" ||
          status ===
            "inService"
          ? "warning"
          : status ===
              "rejected" ||
            status ===
              "cancelled"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className={[
          "mr-1 size-3.5",
          status === "inService"
            ? "animate-pulse"
            : "",
        ].join(" ")}
      />
      {labels[status]}
    </Badge>
  );
}
