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
  Price,
} from "@/components/ui/Price";
import {
  Select,
} from "@/components/ui/Select";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  ReturnDecisionInput,
} from "@/lib/schemas/return";
import type {
  ReturnRequest,
  ReturnResolution,
} from "@/types/return";

interface ReturnDecisionDialogProps {
  readonly open: boolean;
  readonly returnRequest: ReturnRequest | null;
  readonly mode: "approve" | "reject";
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: ReturnDecisionInput
  ) => void | Promise<void>;
}

const resolutionOptions = [
  {
    value: "refund",
    label: "Refund",
  },
  {
    value: "replacement",
    label: "Replacement",
  },
  {
    value: "repair",
    label: "Repair",
  },
  {
    value: "storeCredit",
    label: "Store Credit",
  },
] as const;

export function ReturnDecisionDialog({
  loading = false,
  mode,
  onOpenChange,
  onSubmit,
  open,
  returnRequest,
}: ReturnDecisionDialogProps): React.JSX.Element {
  const approved =
    mode === "approve";

  const [
    resolution,
    setResolution,
  ] =
    useState<ReturnResolution>(
      "refund"
    );

  const [reason, setReason] =
    useState("");

  const [
    customerMessage,
    setCustomerMessage,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setResolution(
      returnRequest
        ?.resolutionRequested ??
        "refund"
    );

    setReason("");
    setCustomerMessage("");
  }, [
    open,
    returnRequest,
  ]);

  const decisionEligible =
    returnRequest?.status ===
      "requested" ||
    returnRequest?.status ===
      "underReview";

  const valid =
    Boolean(returnRequest) &&
    decisionEligible &&
    reason.trim().length >=
      20 &&
    customerMessage.trim()
      .length >= 10;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {approved
              ? "Approve Return Request"
              : "Reject Return Request"}
          </DialogTitle>

          <DialogDescription>
            Publish a recorded return eligibility decision and notify
            the customer.
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
                ? "Approval starts the fulfilment workflow"
                : "Rejection closes the return request"
            }
            description={
              approved
                ? "Pickup, inspection and refund or replacement steps will be controlled by the approved resolution."
                : "The customer should receive a clear policy-based explanation."
            }
            icon={
              approved ? (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <ShieldAlert
                  aria-hidden="true"
                  className="size-5"
                />
              )
            }
          />

          {returnRequest ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Return #
                {
                  returnRequest.returnNumber
                }
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {
                  returnRequest.item
                    .productTitle
                }
              </h3>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm text-muted">
                  Quantity{" "}
                  {
                    returnRequest.item
                      .returnQuantity
                  }
                </span>

                <Price
                  amount={
                    returnRequest
                      .financialSummary
                      .itemValuePaise /
                    100
                  }
                  size="lg"
                />
              </div>
            </section>
          ) : null}

          {approved ? (
            <FormField
              label="Approved Resolution"
              labelFor="return-approved-resolution"
              required
            >
              <Select
                id="return-approved-resolution"
                value={resolution}
                options={
                  resolutionOptions
                }
                disabled={loading}
                onChange={(event) =>
                  setResolution(
                    event.target
                      .value as ReturnResolution
                  )
                }
              />
            </FormField>
          ) : null}

          <FormField
            label={
              approved
                ? "Approval Reason"
                : "Rejection Reason"
            }
            labelFor="return-decision-reason"
            required
            description={`${reason.length}/2500 characters`}
          >
            <Textarea
              id="return-decision-reason"
              value={reason}
              rows={7}
              minLength={20}
              maxLength={2500}
              disabled={loading}
              placeholder="Document the policy, evidence and eligibility basis for this decision."
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
            />
          </FormField>

          <FormField
            label="Customer Message"
            labelFor="return-customer-message"
            required
            description={`${customerMessage.length}/2500 characters`}
          >
            <Textarea
              id="return-customer-message"
              value={
                customerMessage
              }
              rows={6}
              minLength={10}
              maxLength={2500}
              disabled={loading}
              placeholder="Explain the decision and the customer's next steps."
              onChange={(event) =>
                setCustomerMessage(
                  event.target
                    .value
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
                ? "Approving Return"
                : "Rejecting Return"
            }
            onClick={() => {
              if (
                !returnRequest
              ) {
                return;
              }

              void onSubmit({
                returnId:
                  returnRequest.id,
                approved,
                resolution:
                  approved
                    ? resolution
                    : undefined,
                reason:
                  reason.trim(),
                customerMessage:
                  customerMessage.trim(),
              });
            }}
          >
            {approved ? (
              <Gavel
                aria-hidden="true"
                className="size-4"
              />
            ) : (
              <XCircle
                aria-hidden="true"
                className="size-4"
              />
            )}

            {approved
              ? "Approve Return"
              : "Reject Return"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
