"use client";

import {
  CheckCircle2,
  Gavel,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

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
import { Price } from "@/components/ui/Price";
import { Textarea } from "@/components/ui/Textarea";
import type {
  RefundDecisionInput,
} from "@/services/refundService";
import type {
  Refund,
} from "@/types/refund";

interface RefundDecisionDialogProps {
  readonly open: boolean;
  readonly refund: Refund | null;
  readonly decision: "approve" | "reject";
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: RefundDecisionInput
  ) => void | Promise<void>;
}

export function RefundDecisionDialog({
  decision,
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  refund,
}: RefundDecisionDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [
    decision,
    open,
    refund?.id,
  ]);

  const approved =
    decision === "approve";

  const valid =
    Boolean(refund) &&
    refund?.status === "pending" &&
    reason.trim().length >= 10;

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
            {approved
              ? "Approve Refund"
              : "Reject Refund"}
          </DialogTitle>

          <DialogDescription>
            Publish a recorded financial decision for this refund
            request.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              approved
                ? "success"
                : "warning"
            }
            title={
              approved
                ? "Approval authorizes payment processing"
                : "Rejection closes the refund request"
            }
            description={
              approved
                ? "The approved refund will move into the protected payment processing workflow."
                : "The customer should receive a clear and complete explanation for the rejection."
            }
            icon={
              approved ? (
                <CheckCircle2
                  aria-hidden={true}
                  className="size-5"
                />
              ) : (
                <ShieldAlert
                  aria-hidden={true}
                  className="size-5"
                />
              )
            }
          />

          {refund ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    Refund #
                    {refund.refundNumber}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {refund.reason}
                  </p>
                </div>

                <Price
                  amount={
                    refund.amountPaise /
                    100
                  }
                  size="xl"
                />
              </div>
            </section>
          ) : null}

          <FormField
            label={
              approved
                ? "Approval Reason"
                : "Rejection Reason"
            }
            labelFor="refund-decision-reason"
            required
            description={`${reason.length}/1500 characters`}
          >
            <Textarea
              id="refund-decision-reason"
              value={reason}
              rows={7}
              minLength={10}
              maxLength={1500}
              disabled={loading}
              placeholder={
                approved
                  ? "Document the eligibility and financial basis for approval."
                  : "Explain why the refund request cannot be approved."
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
            Cancel
          </Button>

          <Button
            variant={
              approved
                ? "default"
                : "danger"
            }
            disabled={!valid}
            loading={loading}
            loadingLabel={
              approved
                ? "Approving Refund"
                : "Rejecting Refund"
            }
            onClick={() => {
              if (!refund) {
                return;
              }

              void onSubmit({
                refundId:
                  refund.id,
                approved,
                reason:
                  reason.trim(),
              });
            }}
          >
            {approved ? (
              <Gavel
                aria-hidden={true}
                className="size-4"
              />
            ) : (
              <XCircle
                aria-hidden={true}
                className="size-4"
              />
            )}

            {approved
              ? "Approve Refund"
              : "Reject Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
