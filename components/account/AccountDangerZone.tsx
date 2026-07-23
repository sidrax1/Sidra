"use client";

import {
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";

interface AccountDangerZoneProps {
  readonly loading?: boolean;
  readonly deletionDisabled?: boolean;
  readonly onRequestDeletion: () => void;
}

export function AccountDangerZone({
  deletionDisabled = false,
  loading = false,
  onRequestDeletion,
}: AccountDangerZoneProps): React.JSX.Element {
  return (
    <Surface
      className="grid gap-6 border-[color:rgb(145_59_59_/_0.26)]"
      shadow="hover"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-error)]">
          Restricted Actions
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Account Danger Zone
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Account deletion removes access and initiates a secure data
          retention workflow. Active orders, disputes or financial
          obligations may temporarily prevent deletion.
        </p>
      </header>

      <Alert
        variant="warning"
        title="Deletion requires identity confirmation"
        description="You will receive a separate confirmation step before any irreversible account action is executed."
        icon={
          <ShieldAlert
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          variant="danger"
          disabled={
            deletionDisabled
          }
          loading={loading}
          loadingLabel="Preparing Request"
          onClick={
            onRequestDeletion
          }
        >
          <Trash2
            aria-hidden={true}
            className="size-4"
          />
          Request Account Deletion
        </Button>
      </div>
    </Surface>
  );
}
