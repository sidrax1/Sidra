"use client";

import {
  Archive,
  Ban,
  CheckCircle2,
  PauseCircle,
  ShieldAlert,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Select,
} from "@/components/ui/Select";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  UpdateServicePartnerStatusInput,
} from "@/lib/schemas/service-partner";
import type {
  ServicePartner,
  ServicePartnerStatus,
} from "@/types/service-partner";

interface ServicePartnerStatusDialogProps {
  readonly open: boolean;
  readonly partner: ServicePartner | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: UpdateServicePartnerStatusInput
  ) => void | Promise<void>;
}

const statusOptions = [
  {
    value: "pendingVerification",
    label: "Pending Verification",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "temporarilyUnavailable",
    label: "Temporarily Unavailable",
  },
  {
    value: "suspended",
    label: "Suspended",
  },
  {
    value: "rejected",
    label: "Rejected",
  },
  {
    value: "archived",
    label: "Archived",
  },
] as const;

const statusLabels: Record<
  ServicePartnerStatus,
  string
> = {
  pendingVerification:
    "Pending Verification",
  active: "Active",
  temporarilyUnavailable:
    "Temporarily Unavailable",
  suspended: "Suspended",
  rejected: "Rejected",
  archived: "Archived",
};

export function ServicePartnerStatusDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  partner,
}: ServicePartnerStatusDialogProps): React.JSX.Element {
  const [status, setStatus] =
    useState<ServicePartnerStatus>(
      "pendingVerification"
    );

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setStatus(
      partner?.status ??
        "pendingVerification"
    );

    setReason("");
  }, [
    open,
    partner,
  ]);

  const unchanged =
    status === partner?.status;

  const destructive =
    status === "suspended" ||
    status === "rejected" ||
    status === "archived";

  const valid =
    Boolean(partner) &&
    !unchanged &&
    reason.trim().length >= 10;

  const Icon =
    status === "active"
      ? CheckCircle2
      : status ===
          "temporarilyUnavailable"
        ? PauseCircle
        : status ===
            "archived"
          ? Archive
          : status ===
                "suspended" ||
              status ===
                "rejected"
            ? Ban
            : ShieldAlert;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Change Service Partner Status
          </DialogTitle>

          <DialogDescription>
            Update verification, activation, suspension or archival
            state.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              destructive
                ? "warning"
                : "success"
            }
            title={
              destructive
                ? "This status may block new service activity"
                : "Status changes are permanently audited"
            }
            description={
              destructive
                ? "Suspended, rejected and archived partners cannot receive normal assignments."
                : "Activation remains subject to verification, capability and compliance checks."
            }
            icon={
              destructive ? (
                <ShieldAlert
                  aria-hidden={true}
                  className="size-5"
                />
              ) : (
                <Icon
                  aria-hidden={true}
                  className="size-5"
                />
              )
            }
          />

          {partner ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="font-mono text-xs text-muted">
                Partner #
                {
                  partner.partnerNumber
                }
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {
                  partner.displayName
                }
              </h3>

              <p className="mt-2 text-sm text-muted">
                Current status:{" "}
                <strong className="font-medium text-foreground">
                  {
                    statusLabels[
                      partner.status
                    ]
                  }
                </strong>
              </p>
            </section>
          ) : null}

          <FormField
            label="New Status"
            labelFor="service-partner-status"
            required
          >
            <Select
              id="service-partner-status"
              value={status}
              options={statusOptions}
              disabled={loading}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as ServicePartnerStatus
                )
              }
            />
          </FormField>

          <FormField
            label="Status Change Reason"
            labelFor="service-partner-status-reason"
            required
            description={`${reason.length}/2500 characters`}
          >
            <Textarea
              id="service-partner-status-reason"
              value={reason}
              rows={8}
              minLength={10}
              maxLength={2500}
              disabled={loading}
              placeholder="Document the verification, operational, compliance, quality or risk reason for this status change."
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant={
              destructive
                ? "danger"
                : "primary"
            }
            disabled={!valid}
            loading={loading}
            loadingLabel="Updating Status"
            onClick={() => {
              if (!partner) {
                return;
              }

              void onSubmit({
                partnerId:
                  partner.id,
                status,
                reason:
                  reason.trim(),
              });
            }}
          >
            <Icon
              aria-hidden={true}
              className="size-4"
            />
            Set{" "}
            {
              statusLabels[
                status
              ]
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
