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
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type { CustomOrder } from "@/types/custom-order";

export type CustomOrderCancellationReason =
  | "customerRequest"
  | "studioUnavailable"
  | "requirementsUnclear"
  | "paymentFailure"
  | "timelineConflict"
  | "policyViolation"
  | "other";

interface CustomOrderCancellationDialogProps {
  readonly open: boolean;
  readonly customOrder: CustomOrder | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (input: {
    readonly customOrderId: string;
    readonly reason: CustomOrderCancellationReason;
    readonly explanation: string;
    readonly notifyCustomer: boolean;
  }) => void | Promise<void>;
}

const reasonOptions = [
  {
    value: "customerRequest",
    label: "Collector Request",
  },
  {
    value: "studioUnavailable",
    label: "Studio Unavailable",
  },
  {
    value: "requirementsUnclear",
    label: "Requirements Unclear",
  },
  {
    value: "paymentFailure",
    label: "Payment Failure",
  },
  {
    value: "timelineConflict",
    label: "Timeline Conflict",
  },
  {
    value: "policyViolation",
    label: "Policy Violation",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export function CustomOrderCancellationDialog({
  customOrder,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
}: CustomOrderCancellationDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState<CustomOrderCancellationReason>(
      "customerRequest"
    );

  const [
    explanation,
    setExplanation,
  ] = useState("");

  const [
    notifyCustomer,
    setNotifyCustomer,
  ] = useState(true);

  useEffect(() => {
    if (!open) {
      return;
    }

    setReason("customerRequest");
    setExplanation("");
    setNotifyCustomer(true);
  }, [open, customOrder?.id]);

  const valid =
    customOrder !== null &&
    explanation.trim().length >=
      10;

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
            Cancel Custom Commission
          </DialogTitle>

          <DialogDescription>
            Record the approved reason before closing this private
            commission workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant="warning"
            title="Review before continuing"
            description="Cancellation may affect payment settlement, studio capacity and collector communication."
            icon={
              <ShieldAlert
                aria-hidden="true"
                className="size-5"
              />
            }
          />

          <FormField
            label="Cancellation Reason"
            labelFor="custom-order-cancellation-reason"
            required
          >
            <Select
              id="custom-order-cancellation-reason"
              value={reason}
              options={reasonOptions}
              disabled={loading}
              onChange={(event) =>
                setReason(
                  event.target
                    .value as CustomOrderCancellationReason
                )
              }
            />
          </FormField>

          <FormField
            label="Detailed Explanation"
            labelFor="custom-order-cancellation-explanation"
            required
            description={`${explanation.length}/1500 characters`}
          >
            <Textarea
              id="custom-order-cancellation-explanation"
              value={explanation}
              rows={6}
              disabled={loading}
              minLength={10}
              maxLength={1500}
              onChange={(event) =>
                setExplanation(
                  event.target.value
                )
              }
            />
          </FormField>

          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <input
              type="checkbox"
              checked={notifyCustomer}
              disabled={loading}
              onChange={(event) =>
                setNotifyCustomer(
                  event.target.checked
                )
              }
              className="mt-1 size-4 accent-[var(--color-gold-500)]"
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                Notify collector
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                Share the approved explanation through the notification
                system.
              </span>
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep Commission
          </Button>

          <Button
            variant="danger"
            disabled={!valid}
            loading={loading}
            loadingLabel="Cancelling"
            onClick={() => {
              if (!customOrder) {
                return;
              }

              void onConfirm({
                customOrderId:
                  customOrder.id,
                reason,
                explanation:
                  explanation.trim(),
                notifyCustomer,
              });
            }}
          >
            <XCircle aria-hidden="true" />
            Confirm Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
