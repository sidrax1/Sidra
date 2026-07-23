import {
  BadgeCheck,
  CalendarX2,
  CircleDashed,
  FileClock,
  FileQuestion,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerVerificationStatus,
} from "@/types/service-partner";

interface ServicePartnerVerificationBadgeProps {
  readonly status: ServicePartnerVerificationStatus;
}

const verificationLabels: Record<
  ServicePartnerVerificationStatus,
  string
> = {
  notStarted: "Not Started",
  documentsPending:
    "Documents Pending",
  underReview: "Under Review",
  siteInspectionPending:
    "Site Inspection Pending",
  verified: "Verified",
  failed: "Verification Failed",
  expired: "Verification Expired",
};

export function ServicePartnerVerificationBadge({
  status,
}: ServicePartnerVerificationBadgeProps): React.JSX.Element {
  const Icon =
    status === "verified"
      ? ShieldCheck
      : status ===
          "documentsPending"
        ? FileQuestion
        : status ===
            "underReview"
          ? FileClock
          : status ===
              "siteInspectionPending"
            ? CircleDashed
            : status ===
                "failed"
              ? ShieldAlert
              : status ===
                  "expired"
                ? CalendarX2
                : BadgeCheck;

  const variant =
    status === "verified"
      ? "success"
      : status ===
            "underReview" ||
          status ===
            "siteInspectionPending"
        ? "gold"
        : status ===
            "documentsPending"
          ? "warning"
          : status ===
                "failed" ||
              status ===
                "expired"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className={[
          "mr-1 size-3.5",
          status ===
          "siteInspectionPending"
            ? "animate-pulse"
            : "",
        ].join(" ")}
      />

      {
        verificationLabels[
          status
        ]
      }
    </Badge>
  );
}
