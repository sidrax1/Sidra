import {
  BadgeCheck,
  Clock3,
  FileWarning,
  ShieldAlert,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerDocument,
} from "@/types/service-partner";

interface ServicePartnerDocumentStatusBadgeProps {
  readonly document: ServicePartnerDocument;
}

export function ServicePartnerDocumentStatusBadge({
  document,
}: ServicePartnerDocumentStatusBadgeProps): React.JSX.Element {
  const expired =
    Boolean(
      document.expiresAt
    ) &&
    new Date(
      document.expiresAt ??
        ""
    ).getTime() < Date.now();

  const rejected =
    Boolean(
      document.rejectionReason
    );

  const Icon = expired
    ? Clock3
    : rejected
      ? ShieldAlert
      : document.verified
        ? BadgeCheck
        : FileWarning;

  const variant = expired
    ? "error"
    : rejected
      ? "error"
      : document.verified
        ? "success"
        : "warning";

  const label = expired
    ? "Expired"
    : rejected
      ? "Rejected"
      : document.verified
        ? "Verified"
        : "Pending Review";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className="mr-1 size-3.5"
      />
      {label}
    </Badge>
  );
}
