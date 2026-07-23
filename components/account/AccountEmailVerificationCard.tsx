"use client";

import {
  BadgeCheck,
  MailCheck,
  Send,
  ShieldAlert,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

interface AccountEmailVerificationCardProps {
  readonly email: string;
  readonly verified: boolean;
  readonly loading?: boolean;
  readonly onSendVerification?: () => void | Promise<void>;
}

export function AccountEmailVerificationCard({
  email,
  loading = false,
  onSendVerification,
  verified,
}: AccountEmailVerificationCardProps): React.JSX.Element {
  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <MailCheck
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Email Identity
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Email Verification
          </h2>

          <p className="mt-2 break-all text-sm text-muted">
            {email}
          </p>
        </div>
      </header>

      {verified ? (
        <Alert
          variant="success"
          title="Email address verified"
          description="Protected account actions and communication are enabled for this address."
          icon={
            <BadgeCheck
              aria-hidden="true"
              className="size-5"
            />
          }
        />
      ) : (
        <Alert
          variant="warning"
          title="Verification required"
          description="Verify this address before placing protected orders, managing commissions or changing sensitive settings."
          icon={
            <ShieldAlert
              aria-hidden="true"
              className="size-5"
            />
          }
        />
      )}

      {!verified &&
      onSendVerification ? (
        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            loading={loading}
            loadingLabel="Sending Verification"
            onClick={() => {
              void onSendVerification();
            }}
          >
            <Send
              aria-hidden="true"
              className="size-4"
            />
            Send Verification Email
          </Button>
        </div>
      ) : null}
    </Surface>
  );
}
