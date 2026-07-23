import {
  Ban,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCcw,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  WarrantyStatus,
} from "@/types/warranty";

interface WarrantyStatusBadgeProps {
  readonly status: WarrantyStatus;
}

const labels: Record<
  WarrantyStatus,
  string
> = {
  active: "Active",
  expired: "Expired",
  void: "Void",
  transferred: "Transferred",
  claimInProgress:
    "Claim in Progress",
  fulfilled: "Fulfilled",
};

export function WarrantyStatusBadge({
  status,
}: WarrantyStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "active"
      ? ShieldCheck
      : status === "expired"
        ? Clock3
        : status === "void"
          ? Ban
          : status ===
              "transferred"
            ? UserRoundCog
            : status ===
                "claimInProgress"
              ? RefreshCcw
              : FileCheck2;

  const variant =
    status === "active" ||
    status === "fulfilled"
      ? "success"
      : status ===
          "claimInProgress"
        ? "gold"
        : status ===
            "void"
          ? "error"
          : status ===
              "transferred"
            ? "warning"
            : "neutral";

  return (
    <Badge variant={variant}>
      {status ===
      "claimInProgress" ? (
        <RefreshCcw
          aria-hidden={true}
          className="mr-1 size-3.5 animate-spin"
        />
      ) : (
        <Icon
          aria-hidden={true}
          className="mr-1 size-3.5"
        />
      )}

      {labels[status]}
    </Badge>
  );
}
