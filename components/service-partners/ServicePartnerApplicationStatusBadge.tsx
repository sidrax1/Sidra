import {
  BadgeCheck,
  CircleDashed,
  FileQuestion,
  FileText,
  ShieldAlert,
  Undo2,
  XCircle,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationStatusBadgeProps {
  readonly status: ServicePartnerApplication["status"];
}

const statusLabels: Record<
  ServicePartnerApplication["status"],
  string
> = {
  draft: "Draft",
  submitted: "Submitted",
  underReview: "Under Review",
  additionalInformationRequired:
    "Information Required",
  approved: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export function ServicePartnerApplicationStatusBadge({
  status,
}: ServicePartnerApplicationStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "approved"
      ? BadgeCheck
      : status === "submitted"
        ? FileText
        : status === "underReview"
          ? CircleDashed
          : status ===
              "additionalInformationRequired"
            ? FileQuestion
            : status === "rejected"
              ? XCircle
              : status === "withdrawn"
                ? Undo2
                : ShieldAlert;

  const variant =
    status === "approved"
      ? "success"
      : status === "underReview"
        ? "gold"
        : status ===
            "additionalInformationRequired"
          ? "warning"
          : status === "rejected"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className={[
          "mr-1 size-3.5",
          status === "underReview"
            ? "animate-pulse"
            : "",
        ].join(" ")}
      />
      {statusLabels[status]}
    </Badge>
  );
}
