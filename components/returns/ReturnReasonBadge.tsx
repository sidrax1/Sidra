import {
  BadgeHelp,
  Boxes,
  CalendarX,
  CircleAlert,
  PackageMinus,
  PackageOpen,
  PackageX,
  Ruler,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ReturnReason,
} from "@/types/return";

interface ReturnReasonBadgeProps {
  readonly reason: ReturnReason;
}

const labels: Record<
  ReturnReason,
  string
> = {
  damaged: "Damaged",
  defective: "Defective",
  wrongItem: "Wrong Item",
  notAsDescribed:
    "Not as Described",
  missingParts:
    "Missing Parts",
  qualityConcern:
    "Quality Concern",
  sizeOrDimensionIssue:
    "Size or Dimension Issue",
  changedMind:
    "Changed Mind",
  lateDelivery:
    "Late Delivery",
  other: "Other",
};

export function ReturnReasonBadge({
  reason,
}: ReturnReasonBadgeProps): React.JSX.Element {
  const Icon =
    reason === "damaged"
      ? PackageX
      : reason ===
          "defective"
        ? ShieldAlert
        : reason ===
            "wrongItem"
          ? Boxes
          : reason ===
              "notAsDescribed"
            ? CircleAlert
            : reason ===
                "missingParts"
              ? PackageMinus
              : reason ===
                  "qualityConcern"
                ? Sparkles
                : reason ===
                    "sizeOrDimensionIssue"
                  ? Ruler
                  : reason ===
                      "changedMind"
                    ? PackageOpen
                    : reason ===
                        "lateDelivery"
                      ? CalendarX
                      : BadgeHelp;

  const variant =
    reason === "damaged" ||
    reason === "defective"
      ? "error"
      : reason ===
          "wrongItem" ||
        reason ===
          "notAsDescribed" ||
        reason ===
          "missingParts"
        ? "warning"
        : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className="mr-1 size-3.5"
      />
      {labels[reason]}
    </Badge>
  );
}
