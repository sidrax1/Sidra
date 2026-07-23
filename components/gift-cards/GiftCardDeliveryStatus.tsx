import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  MailCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { GiftCardDeliveryStatus } from "@/types/gift-card";

interface GiftCardDeliveryStatusProps {
  readonly status: GiftCardDeliveryStatus;
}

const labels: Record<GiftCardDeliveryStatus, string> = {
  scheduled: "Scheduled",
  sent: "Sent",
  delivered: "Delivered",
  failed: "Delivery Failed",
};

export function GiftCardDeliveryStatus({
  status,
}: GiftCardDeliveryStatusProps): React.JSX.Element {
  const Icon =
    status === "scheduled"
      ? CalendarClock
      : status === "sent"
        ? MailCheck
        : status === "delivered"
          ? CheckCircle2
          : AlertTriangle;

  const variant =
    status === "delivered"
      ? "success"
      : status === "sent"
        ? "gold"
        : status === "failed"
          ? "error"
          : "warning";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[status]}
    </Badge>
  );
}
