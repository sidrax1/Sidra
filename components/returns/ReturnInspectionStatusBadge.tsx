import {
  CheckCircle2,
  CircleDashed,
  FileSearch,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  ReturnInspectionStatus,
} from "@/types/return";

interface ReturnInspectionStatusBadgeProps {
  readonly status: ReturnInspectionStatus;
}

const statusLabels: Record<
  ReturnInspectionStatus,
  string
> = {
  notStarted: "Not Started",
  inProgress: "In Progress",
  passed: "Passed",
  partiallyPassed: "Partially Passed",
  failed: "Failed",
};

export function ReturnInspectionStatusBadge({
  status,
}: ReturnInspectionStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "passed"
      ? ShieldCheck
      : status === "partiallyPassed"
        ? FileSearch
        : status === "failed"
          ? ShieldAlert
          : status === "inProgress"
            ? CircleDashed
            : CheckCircle2;

  const variant =
    status === "passed"
      ? "success"
      : status === "partiallyPassed"
        ? "warning"
        : status === "failed"
          ? "error"
          : status === "inProgress"
            ? "gold"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className={[
          "mr-1 size-3.5",
          status === "inProgress"
            ? "animate-spin"
            : "",
        ].join(" ")}
      />
      {statusLabels[status]}
    </Badge>
  );
}
