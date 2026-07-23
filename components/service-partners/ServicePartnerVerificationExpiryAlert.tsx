import {
  CalendarClock,
  CalendarX2,
  ShieldCheck,
} from "lucide-react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  formatDate,
} from "@/lib/date";
import type {
  ServicePartnerVerification,
} from "@/types/service-partner";

interface ServicePartnerVerificationExpiryAlertProps {
  readonly verification: ServicePartnerVerification;
  readonly warningDays?: number;
}

export function ServicePartnerVerificationExpiryAlert({
  verification,
  warningDays = 30,
}: ServicePartnerVerificationExpiryAlertProps): React.JSX.Element | null {
  if (
    !verification.expiresAt
  ) {
    return null;
  }

  const expiryTimestamp =
    new Date(
      verification.expiresAt
    ).getTime();

  if (
    Number.isNaN(
      expiryTimestamp
    )
  ) {
    return null;
  }

  const remainingDays =
    Math.ceil(
      (expiryTimestamp -
        Date.now()) /
        86_400_000
    );

  if (
    remainingDays >
    warningDays
  ) {
    return null;
  }

  if (remainingDays < 0) {
    return (
      <Alert
        variant="error"
        title="Partner verification has expired"
        description={`Verification expired on ${formatDate(
          verification.expiresAt
        )}. New assignments should remain blocked until reverification is completed.`}
        icon={
          <CalendarX2
            aria-hidden="true"
            className="size-5"
          />
        }
      />
    );
  }

  if (remainingDays === 0) {
    return (
      <Alert
        variant="warning"
        title="Verification expires today"
        description="Complete the reverification workflow before the partner receives additional assignments."
        icon={
          <CalendarClock
            aria-hidden="true"
            className="size-5"
          />
        }
      />
    );
  }

  return (
    <Alert
      variant="warning"
      title={`Verification expires in ${remainingDays} day${
        remainingDays === 1
          ? ""
          : "s"
      }`}
      description={`Current verification remains valid until ${formatDate(
        verification.expiresAt
      )}. Begin the renewal workflow before expiry.`}
      icon={
        <ShieldCheck
          aria-hidden="true"
          className="size-5"
        />
      }
    />
  );
}
