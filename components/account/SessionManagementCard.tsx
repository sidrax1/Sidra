"use client";

import {
  LogOut,
  MonitorSmartphone,
  ShieldAlert,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

interface SessionManagementCardProps {
  readonly activeSessionCount: number;
  readonly loading?: boolean;
  readonly onRevokeOtherSessions: () => void | Promise<void>;
}

export function SessionManagementCard({
  activeSessionCount,
  loading = false,
  onRevokeOtherSessions,
}: SessionManagementCardProps): React.JSX.Element {
  const otherSessionCount =
    Math.max(
      activeSessionCount - 1,
      0
    );

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <MonitorSmartphone
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Session Control
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Signed-In Devices
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            {activeSessionCount.toLocaleString(
              "en-IN"
            )}{" "}
            authenticated{" "}
            {activeSessionCount === 1
              ? "session is"
              : "sessions are"}{" "}
            currently associated with your account.
          </p>
        </div>
      </header>

      {otherSessionCount > 0 ? (
        <Alert
          variant="warning"
          title={`${otherSessionCount.toLocaleString(
            "en-IN"
          )} other ${
            otherSessionCount === 1
              ? "session"
              : "sessions"
          } detected`}
          description="Revoking other sessions requires those devices to authenticate again."
          icon={
            <ShieldAlert
              aria-hidden={true}
              className="size-5"
            />
          }
        />
      ) : (
        <Alert
          variant="success"
          title="Only this session is active"
          description="No additional authenticated devices are currently associated with your account."
          icon={
            <MonitorSmartphone
              aria-hidden={true}
              className="size-5"
            />
          }
        />
      )}

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          variant="danger"
          disabled={
            otherSessionCount === 0
          }
          loading={loading}
          loadingLabel="Revoking Sessions"
          onClick={() => {
            void onRevokeOtherSessions();
          }}
        >
          <LogOut
            aria-hidden={true}
            className="size-4"
          />
          Revoke Other Sessions
        </Button>
      </div>
    </Surface>
  );
}
