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
  WarrantyClaimDecisionInput,
} from "@/lib/schemas/warranty";
import type {
  WarrantyClaim,
  WarrantyClaimResolution,
} from "@/types/warranty";

interface WarrantyClaimDecisionDialogProps {
  readonly open: boolean;
  readonly claim: WarrantyClaim | null;
  readonly mode:
    | "approve"
    | "reject";
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: WarrantyClaimDecisionInput
  ) => void | Promise<void>;
}

const approvedResolutionOptions = [
  {
    value: "repair",
    label: "Repair",
  },
  {
    value: "replacement",
    label: "Replacement",
  },
  {
    value: "partialRefund",
    label: "Partial Refund",
  },
  {
    value: "fullRefund",
    label: "Full Refund",
  },
  {
    value: "storeCredit",
    label: "Store Credit",
  },
] as const;

export function WarrantyClaimDecisionDialog({
  claim,
  loading = false,
  mode,
  onOpenChange,
  onSubmit,
  open,
}: WarrantyClaimDecisionDialogProps): React.JSX.Element {
  const approved =
    mode === "approve";

  const [
    resolution,
    setResolution,
  ] =
    useState<WarrantyClaimResolution>(
      "repair"
    );

  const [reason, setReason] =
    useState("");

  const [
    customerMessage,
    setCustomerMessage,
  ] = useState("");

  const [
    internalNote,
    setInternalNote,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setResolution(
      approved
        ? claim
            ?.requestedResolution ??
            "repair"
        : "claimRejected"
    );

    setReason(
      claim?.decision
        ?.reason ?? ""
    );

    setCustomerMessage(
      claim?.decision
        ?.customerMessage ?? ""
    );

    setInternalNote(
      claim?.decision
        ?.internalNote ?? ""
    );
  }, [
    approved,
    claim,
    open,
  ]);

  const decisionEligible =
    claim
      ? [
          "submitted",
          "underReview",
          "evidenceRequired",
          "approved",
        ].includes(claim.status)
      : false;

  const assessmentRequired =
    approved &&
    !claim?.assessment;

  const valid =
    Boolean(claim) &&
    decisionEligible &&
    !assessmentRequired &&
    reason.trim().length >= 20 &&
    customerMessage.trim()
      .length >= 10;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[94vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {approved
              ? "Approve Warranty Claim"
              : "Reject Warranty Claim"}
          </DialogTitle>

          <DialogDescription>
            Publish a final claim decision and create the next
            protected service or financial workflow.
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
              assessmentRequired
                ? "Coverage assessment is required"
                : approved
                  ? "Approval authorizes claim fulfilment"
                  : "Rejection closes the claim"
            }
            description={
              assessmentRequired
                ? "Complete the warranty coverage assessment before approving this claim."
                : approved
                  ? "The approved resolution will determine repair, replacement or financial processing."
                  : "Provide a clear warranty-term explanation for the customer."
            }
            icon={
              assessmentRequired ||
              !approved ? (
                <ShieldAlert
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <CheckCircle2
                  aria-hidden="true"
                  className="size-5"
                />
              )
            }
          />

          {claim ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Claim #
                {claim.claimNumber}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {claim.issueTitle}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
                {
                  claim.issueDescription
                }
              </p>

              {claim.assessment ? (
                <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Estimated Cost
                    </dt>

                    <dd className="mt-2">
                      <Price
                        amount={
                          claim.assessment
                            .estimatedServiceCostPaise /
                          100
                        }
                        size="sm"
                      />
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Approved Coverage
                    </dt>

                    <dd className="mt-2">
                      <Price
                        amount={
                          claim.assessment
                            .approvedCoveragePaise /
                          100
                        }
                        size="sm"
                      />
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                      Customer Payable
                    </dt>

                    <dd className="mt-2">
                      <Price
                        amount={
                          claim.assessment
                            .customerPayablePaise /
                          100
                        }
                        size="sm"
                      />
                    </dd>
                  </div>
                </dl>
              ) : null}
            </section>
          ) : null}

          {approved ? (
            <FormField
              label="Approved Resolution"
              labelFor="warranty-decision-resolution"
              required
            >
              <Select
                id="warranty-decision-resolution"
                value={resolution}
                options={
                  approvedResolutionOptions
                }
                disabled={loading}
                onChange={(event) =>
                  setResolution(
                    event.target
                      .value as WarrantyClaimResolution
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
            labelFor="warranty-decision-reason"
            required
            description={`${reason.length}/4000 characters`}
          >
            <Textarea
              id="warranty-decision-reason"
              value={reason}
              rows={8}
              minLength={20}
              maxLength={4000}
              disabled={loading}
              placeholder="Document the evidence, coverage terms, assessment and final decision basis."
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
            />
          </FormField>

          <FormField
            label="Customer Message"
            labelFor="warranty-decision-customer-message"
            required
            description={`${customerMessage.length}/3000 characters`}
          >
            <Textarea
              id="warranty-decision-customer-message"
              value={
                customerMessage
              }
              rows={7}
              minLength={10}
              maxLength={3000}
              disabled={loading}
              placeholder="Explain the decision, approved resolution and next steps in customer-friendly language."
              onChange={(event) =>
                setCustomerMessage(
                  event.target.value
                )
              }
            />
          </FormField>

          <FormField
            label="Internal Note"
            labelFor="warranty-decision-internal-note"
            optional
            description={`${internalNote.length}/3000 characters`}
          >
            <Textarea
              id="warranty-decision-internal-note"
              value={internalNote}
              rows={6}
              maxLength={3000}
              disabled={loading}
              placeholder="Record internal operational, risk or service instructions."
              onChange={(event) =>
                setInternalNote(
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
                ? "Approving Claim"
                : "Rejecting Claim"
            }
            onClick={() => {
              if (!claim) {
                return;
              }

              void onSubmit({
                claimId: claim.id,
                approved,
                resolution:
                  approved
                    ? resolution
                    : "claimRejected",
                reason:
                  reason.trim(),
                customerMessage:
                  customerMessage.trim(),
                internalNote:
                  internalNote.trim() ||
                  undefined,
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
              ? "Approve Claim"
              : "Reject Claim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
