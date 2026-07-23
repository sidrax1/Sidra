"use client";

import {
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
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
  Textarea,
} from "@/components/ui/Textarea";
import type {
  WarrantyClaim,
} from "@/types/warranty";

interface WarrantyClaimCompletionDialogProps {
  readonly open: boolean;
  readonly claim: WarrantyClaim | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    claimId: string,
    completionNote: string
  ) => void | Promise<void>;
}

export function WarrantyClaimCompletionDialog({
  claim,
  loading = false,
  onOpenChange,
  onSubmit,
  open,
}: WarrantyClaimCompletionDialogProps): React.JSX.Element {
  const [
    completionNote,
    setCompletionNote,
  ] = useState("");

  useEffect(() => {
    if (open) {
      setCompletionNote("");
    }
  }, [
    claim?.id,
    open,
  ]);

  const completable =
    claim
      ? [
          "approved",
          "repairScheduled",
          "replacementApproved",
          "refundApproved",
          "inService",
        ].includes(claim.status)
      : false;

  const valid =
    Boolean(claim) &&
    completable &&
    completionNote.trim()
      .length >= 10;

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
            Complete Warranty Claim
          </DialogTitle>

          <DialogDescription>
            Record successful claim fulfilment and close the protected
            service workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title="Completion closes active fulfilment"
            description="Confirm that repair, replacement, refund or store-credit obligations have been completed."
            icon={
              <ShieldCheck
                aria-hidden="true"
                className="size-5"
              />
            }
          />

          {claim ? (
            <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted">
                  Claim #
                  {claim.claimNumber}
                </p>

                <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                  {claim.issueTitle}
                </h3>
              </div>

              <dl className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                    Resolution
                  </dt>

                  <dd className="mt-2 text-sm font-medium capitalize text-foreground">
                    {claim.decision
                      ?.resolution.replace(
                        /([A-Z])/g,
                        " $1"
                      ) ??
                      "Not recorded"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">
                    Approved Coverage
                  </dt>

                  <dd className="mt-2">
                    <Price
                      amount={
                        (claim.assessment
                          ?.approvedCoveragePaise ??
                          0) / 100
                      }
                      size="sm"
                    />
                  </dd>
                </div>
              </dl>
            </section>
          ) : null}

          <FormField
            label="Completion Note"
            labelFor="warranty-completion-note"
            required
            description={`${completionNote.length}/2500 characters`}
          >
            <Textarea
              id="warranty-completion-note"
              value={
                completionNote
              }
              rows={8}
              minLength={10}
              maxLength={2500}
              disabled={loading}
              placeholder="Document the completed service, replacement shipment, financial reference, customer confirmation and final condition."
              onChange={(event) =>
                setCompletionNote(
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
            disabled={!valid}
            loading={loading}
            loadingLabel="Completing Claim"
            onClick={() => {
              if (!claim) {
                return;
              }

              void onSubmit(
                claim.id,
                completionNote.trim()
              );
            }}
          >
            <CheckCircle2
              aria-hidden="true"
              className="size-4"
            />
            Complete Claim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
