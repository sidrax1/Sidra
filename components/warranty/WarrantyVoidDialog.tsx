"use client";

import {
  Ban,
  ShieldAlert,
  TriangleAlert,
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
  Textarea,
} from "@/components/ui/Textarea";
import type {
  VoidWarrantyInput,
} from "@/lib/schemas/warranty";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyVoidDialogProps {
  readonly open: boolean;
  readonly warranty: ProductWarranty | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: VoidWarrantyInput
  ) => void | Promise<void>;
}

export function WarrantyVoidDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  warranty,
}: WarrantyVoidDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [
    open,
    warranty?.id,
  ]);

  const alreadyVoid =
    warranty?.status === "void";

  const valid =
    Boolean(warranty) &&
    !alreadyVoid &&
    reason.trim().length >= 20;

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
            Void Product Warranty
          </DialogTitle>

          <DialogDescription>
            Permanently revoke warranty eligibility and future claim
            access.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="error"
            title="This action has serious customer impact"
            description="A voided warranty cannot create new claims. The reason is recorded in the permanent audit trail."
            icon={
              <TriangleAlert
                aria-hidden="true"
                className="size-5"
              />
            }
          />

          {warranty ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.07)] text-[var(--color-error)]">
                  <ShieldAlert
                    aria-hidden="true"
                    className="size-5"
                  />
                </span>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    Warranty #
                    {
                      warranty.warrantyNumber
                    }
                  </p>

                  <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                    {
                      warranty.product
                        .productTitle
                    }
                  </h3>

                  <p className="mt-2 text-sm text-muted">
                    Owner:{" "}
                    {
                      warranty.owner
                        .customerEmail
                    }
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          <FormField
            label="Void Reason"
            labelFor="warranty-void-reason"
            required
            description={`${reason.length}/2500 characters`}
          >
            <Textarea
              id="warranty-void-reason"
              value={reason}
              rows={9}
              minLength={20}
              maxLength={2500}
              disabled={
                loading ||
                alreadyVoid
              }
              placeholder="Document the policy, evidence, product alteration, misuse, fraud or other basis for voiding this warranty."
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

          {!alreadyVoid ? (
            <Button
              variant="danger"
              disabled={!valid}
              loading={loading}
              loadingLabel="Voiding Warranty"
              onClick={() => {
                if (!warranty) {
                  return;
                }

                void onSubmit({
                  warrantyId:
                    warranty.id,
                  reason:
                    reason.trim(),
                });
              }}
            >
              <Ban
                aria-hidden="true"
                className="size-4"
              />
              Void Warranty
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
