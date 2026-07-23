import {
  BadgeCheck,
  KeyRound,
  Link2,
  MonitorSmartphone,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";
import { formatDateTime } from "@/lib/date";
import type { AccountSecuritySummary } from "@/types/account";

interface AccountSecuritySummaryCardProps {
  readonly security: AccountSecuritySummary;
}

export function AccountSecuritySummaryCard({
  security,
}: AccountSecuritySummaryCardProps): React.JSX.Element {
  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="flex flex-col gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Account Protection
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Security Overview
          </h2>
        </div>

        <Badge
          variant={
            security.emailVerified
              ? "success"
              : "warning"
          }
        >
          <ShieldCheck
            aria-hidden="true"
            className="mr-1 size-3.5"
          />
          {security.emailVerified
            ? "Protected"
            : "Action Required"}
        </Badge>
      </header>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <BadgeCheck
              aria-hidden="true"
              className="size-5 text-[var(--color-success)]"
            />

            <Badge
              variant={
                security.emailVerified
                  ? "success"
                  : "warning"
              }
            >
              {security.emailVerified
                ? "Verified"
                : "Pending"}
            </Badge>
          </div>

          <h3 className="mt-4 text-sm font-medium text-foreground">
            Email Verification
          </h3>

          <p className="mt-2 text-xs leading-5 text-muted">
            Required for protected account actions.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <Link2
              aria-hidden="true"
              className="size-5 text-[var(--color-gold-600)]"
            />

            <Badge
              variant={
                security.googleConnected
                  ? "success"
                  : "neutral"
              }
            >
              {security.googleConnected
                ? "Connected"
                : "Not Connected"}
            </Badge>
          </div>

          <h3 className="mt-4 text-sm font-medium text-foreground">
            Google Account
          </h3>

          <p className="mt-2 text-xs leading-5 text-muted">
            Secure sign-in connection for account access.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
          <KeyRound
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h3 className="mt-4 text-sm font-medium text-foreground">
            Password
          </h3>

          <p className="mt-2 text-xs leading-5 text-muted">
            {security.lastPasswordChangeAt
              ? `Changed ${formatDateTime(
                  security.lastPasswordChangeAt
                )}`
              : "No recent password change recorded."}
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
          <MonitorSmartphone
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h3 className="mt-4 text-sm font-medium text-foreground">
            Active Sessions
          </h3>

          <p className="mt-2 text-xs leading-5 text-muted">
            {security.activeSessionCount.toLocaleString(
              "en-IN"
            )}{" "}
            authenticated{" "}
            {security.activeSessionCount ===
            1
              ? "session"
              : "sessions"}
          </p>
        </div>
      </div>
    </Surface>
  );
}
