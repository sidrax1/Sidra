"use client";

import {
  BadgeCheck,
  Link2,
  Unlink,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

interface ConnectedAccountCardProps {
  readonly providerName: string;
  readonly providerEmail?: string;
  readonly connected: boolean;
  readonly loading?: boolean;
  readonly onConnect?: () => void | Promise<void>;
  readonly onDisconnect?: () => void | Promise<void>;
}

export function ConnectedAccountCard({
  connected,
  loading = false,
  onConnect,
  onDisconnect,
  providerEmail,
  providerName,
}: ConnectedAccountCardProps): React.JSX.Element {
  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
            <Link2
              aria-hidden={true}
              className="size-5"
            />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
              Connected Identity
            </p>

            <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {providerName}
            </h2>

            {providerEmail ? (
              <p className="mt-2 text-sm text-muted">
                {providerEmail}
              </p>
            ) : null}
          </div>
        </div>

        <Badge
          variant={
            connected
              ? "success"
              : "neutral"
          }
        >
          {connected ? (
            <BadgeCheck
              aria-hidden={true}
              className="mr-1 size-3.5"
            />
          ) : null}

          {connected
            ? "Connected"
            : "Not Connected"}
        </Badge>
      </header>

      <p className="text-sm leading-6 text-muted">
        Connected identity providers offer a secure additional way
        to access your Sydra account without exposing account
        credentials to the application.
      </p>

      <div className="flex justify-end border-t border-border pt-5">
        {connected &&
        onDisconnect ? (
          <Button
            variant="outline"
            disabled={loading}
            loading={loading}
            loadingLabel="Disconnecting"
            onClick={() => {
              void onDisconnect();
            }}
          >
            <Unlink
              aria-hidden={true}
              className="size-4"
            />
            Disconnect
          </Button>
        ) : !connected &&
          onConnect ? (
          <Button
            disabled={loading}
            loading={loading}
            loadingLabel="Connecting"
            onClick={() => {
              void onConnect();
            }}
          >
            <Link2
              aria-hidden={true}
              className="size-4"
            />
            Connect Account
          </Button>
        ) : null}
      </div>
    </Surface>
  );
}
