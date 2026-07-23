import {
  BadgeAlert,
  BadgeHelp,
  Ban,
  CircleDollarSign,
  FileWarning,
  Flag,
  Megaphone,
  MessageSquareWarning,
  ShieldAlert,
  UserRoundX,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  ReviewReportReason,
} from "@/types/review-report";

interface ReviewReportReasonBadgeProps {
  readonly reason: ReviewReportReason;
}

const labels: Record<
  ReviewReportReason,
  string
> = {
  spam: "Spam",
  harassment: "Harassment",
  hateSpeech: "Hate Speech",
  personalInformation: "Personal Information",
  falseInformation: "False Information",
  irrelevantContent: "Irrelevant Content",
  commercialPromotion: "Commercial Promotion",
  conflictOfInterest: "Conflict of Interest",
  prohibitedContent: "Prohibited Content",
  other: "Other",
};

export function ReviewReportReasonBadge({
  reason,
}: ReviewReportReasonBadgeProps): React.JSX.Element {
  const Icon =
    reason === "spam"
      ? MessageSquareWarning
      : reason === "harassment"
        ? UserRoundX
        : reason === "hateSpeech"
          ? ShieldAlert
          : reason === "personalInformation"
            ? FileWarning
            : reason === "falseInformation"
              ? BadgeAlert
              : reason === "irrelevantContent"
                ? Flag
                : reason === "commercialPromotion"
                  ? Megaphone
                  : reason === "conflictOfInterest"
                    ? CircleDollarSign
                    : reason === "prohibitedContent"
                      ? Ban
                      : BadgeHelp;

  const variant =
    reason === "hateSpeech" ||
    reason === "personalInformation" ||
    reason === "prohibitedContent"
      ? "error"
      : reason === "harassment" ||
          reason === "falseInformation" ||
          reason === "conflictOfInterest"
        ? "warning"
        : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[reason]}
    </Badge>
  );
}
