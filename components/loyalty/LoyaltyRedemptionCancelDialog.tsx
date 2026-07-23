"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Textarea } from "@/components/ui/Textarea";
import type {
  LoyaltyRedemption,
} from "@/types/loyalty";

interface LoyaltyRedemptionCancelDialogProps {
  readonly open: boolean;
  readonly redemption: LoyaltyRedemption | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    redemptionId: string,
    reason: string
  ) => void | Promise<void>;
}

export function LoyaltyRedemptionCancelDialog({
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  redemption,
}: LoyaltyRedemptionCancelDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open, redemption?.id]);

  const cancellable =
    redemption?.status === "pending" ||
    redemption?.status === "issued";

  const valid =
    Boolean(redemption) &&
    cancellable &&
    reason.trim().length >= 10;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Cancel Reward Redemption
          </DialogTitle>

          <DialogDescription>
            Cancel an unused issued reward and return eligible points
            to the loyalty account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant="warning"
            title={
              cancellable
                ? "Cancellation creates a reversing transaction"
                : "This redemption cannot be cancelled"
            }
            description={
              cancellable
                ? "The issued reward code will be disabled and the point ledger will be updated atomically."
                : "Applied, used, expired, cancelled or reversed rewards require manual support review."
            }
            icon={
              <ShieldAlert
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          {redemption ? (
            <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Redemption
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {redemption.rewardName}
              </h3>

              <p className="mt-2 text-sm text-muted">
                {redemption.pointsSpent.toLocaleString(
                  "en-IN"
                )}{" "}
                points
              </p>
            </div>
          ) : null}

          <FormField
            label="Cancellation Reason"
            labelFor="loyalty-redemption-cancellation-reason"
            required
            description={`${reason.length}/1500 characters`}
          >
            <Textarea
              id="loyalty-redemption-cancellation-reason"
              value={reason}
              rows={7}
              minLength={10}
              maxLength={1500}
              disabled={
                loading ||
                !cancellable
              }
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
            Keep Reward
          </Button>

          <Button
            variant="danger"
            disabled={!valid}
            loading={loading}
            loadingLabel="Cancelling Redemption"
            onClick={() => {
              if (redemption) {
                void onConfirm(
                  redemption.id,
                  reason.trim()
                );
              }
            }}
          >
            <XCircle
              aria-hidden={true}
              className="size-4"
            />
            Cancel Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
