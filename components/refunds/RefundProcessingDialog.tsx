"use client";

import {
  CreditCard,
  LoaderCircle,
  ShieldCheck,
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
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";
import type {
  RefundProcessingInput,
} from "@/services/refundService";
import type {
  Refund,
} from "@/types/refund";

interface RefundProcessingDialogProps {
  readonly open: boolean;
  readonly refund: Refund | null;
  readonly mode:
    | "start"
    | "complete";
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: RefundProcessingInput
  ) => void | Promise<void>;
}

export function RefundProcessingDialog({
  loading = false,
  mode,
  onOpenChange,
  onSubmit,
  open,
  refund,
}: RefundProcessingDialogProps): React.JSX.Element {
  const [
    providerReference,
    setProviderReference,
  ] = useState("");

  useEffect(() => {
    if (open) {
      setProviderReference(
        refund?.transactionReference ??
          ""
      );
    }
  }, [
    open,
    refund,
  ]);

  const starting =
    mode === "start";

  const eligible =
    refund
      ? starting
        ? refund.status ===
          "approved"
        : refund.status ===
          "processing"
      : false;

  const valid =
    Boolean(refund) &&
    eligible &&
    (starting ||
      providerReference.trim()
        .length >= 3);

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
            {starting
              ? "Begin Refund Processing"
              : "Complete Refund"}
          </DialogTitle>

          <DialogDescription>
            {starting
              ? "Move the approved refund into the payment-provider processing workflow."
              : "Record successful provider settlement and complete the refund."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title={
              starting
                ? "Provider processing will begin"
                : "Completion confirms funds were returned"
            }
            description={
              starting
                ? "The server will enforce idempotency and prevent duplicate provider refund requests."
                : "Confirm the payment-provider reference before marking this refund as completed."
            }
            icon={
              <ShieldCheck
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          {refund ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Refund #
                {refund.refundNumber}
              </p>

              <Price
                amount={
                  refund.amountPaise /
                  100
                }
                size="xl"
                className="mt-2"
              />

              <p className="mt-3 font-mono text-xs text-muted">
                Payment{" "}
                {refund.paymentId}
              </p>
            </section>
          ) : null}

          <FormField
            label="Provider Reference"
            labelFor="refund-provider-reference"
            required={!starting}
            optional={starting}
            description={
              starting
                ? "Optional when the provider reference is assigned asynchronously."
                : "Required to complete the refund."
            }
          >
            <div className="relative">
              <CreditCard
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="refund-provider-reference"
                value={
                  providerReference
                }
                disabled={loading}
                maxLength={200}
                className="pl-11 font-mono"
                onChange={(event) =>
                  setProviderReference(
                    event.target
                      .value
                  )
                }
              />
            </div>
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
            disabled={!valid}
            loading={loading}
            loadingLabel={
              starting
                ? "Starting Processing"
                : "Completing Refund"
            }
            onClick={() => {
              if (!refund) {
                return;
              }

              void onSubmit({
                refundId:
                  refund.id,
                providerReference:
                  providerReference.trim() ||
                  undefined,
              });
            }}
          >
            <LoaderCircle
              aria-hidden={true}
              className="size-4"
            />

            {starting
              ? "Begin Processing"
              : "Complete Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
