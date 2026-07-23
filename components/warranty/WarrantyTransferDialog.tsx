"use client";

import {
  ArrowRightLeft,
  Mail,
  ShieldAlert,
  UserRoundCheck,
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
  Input,
} from "@/components/ui/Input";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  TransferWarrantyInput,
} from "@/lib/schemas/warranty";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyTransferDialogProps {
  readonly open: boolean;
  readonly warranty: ProductWarranty | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: TransferWarrantyInput
  ) => void | Promise<void>;
}

const emailPattern =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WarrantyTransferDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  warranty,
}: WarrantyTransferDialogProps): React.JSX.Element {
  const [
    newOwnerEmail,
    setNewOwnerEmail,
  ] = useState("");

  const [
    transferReason,
    setTransferReason,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setNewOwnerEmail("");
    setTransferReason("");
  }, [
    open,
    warranty?.id,
  ]);

  const transferable =
    Boolean(
      warranty?.transferable
    ) &&
    warranty?.status ===
      "active";

  const sameOwner =
    newOwnerEmail
      .trim()
      .toLowerCase() ===
    warranty?.owner.customerEmail
      .trim()
      .toLowerCase();

  const valid =
    Boolean(warranty) &&
    transferable &&
    emailPattern.test(
      newOwnerEmail.trim()
    ) &&
    !sameOwner &&
    transferReason.trim()
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
            Transfer Warranty Ownership
          </DialogTitle>

          <DialogDescription>
            Move an eligible product warranty to another verified
            customer account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              transferable
                ? "warning"
                : "error"
            }
            title={
              transferable
                ? "Ownership transfer is permanent"
                : "This warranty cannot be transferred"
            }
            description={
              transferable
                ? "The new owner must have or create a Sidra account using the supplied email address."
                : "Only active warranties marked as transferable can use this workflow."
            }
            icon={
              transferable ? (
                <ShieldAlert
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <ArrowRightLeft
                  aria-hidden="true"
                  className="size-5"
                />
              )
            }
          />

          {warranty ? (
            <section className="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-background p-5">
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
              </div>

              <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">
                  Current Owner
                </p>

                <p className="mt-2 text-sm font-medium text-foreground">
                  {
                    warranty.owner
                      .customerName
                  }
                </p>

                <p className="mt-1 text-xs text-muted">
                  {
                    warranty.owner
                      .customerEmail
                  }
                </p>
              </div>
            </section>
          ) : null}

          <FormField
            label="New Owner Email"
            labelFor="warranty-transfer-email"
            required
            error={
              newOwnerEmail.length >
                0 &&
              (!emailPattern.test(
                newOwnerEmail.trim()
              ) ||
                sameOwner)
                ? sameOwner
                  ? "New owner must be different from the current owner."
                  : "Enter a valid email address."
                : undefined
            }
          >
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="warranty-transfer-email"
                type="email"
                value={newOwnerEmail}
                maxLength={254}
                disabled={loading}
                className="pl-11"
                placeholder="new-owner@example.com"
                invalid={
                  newOwnerEmail.length >
                    0 &&
                  (!emailPattern.test(
                    newOwnerEmail.trim()
                  ) ||
                    sameOwner)
                }
                onChange={(event) =>
                  setNewOwnerEmail(
                    event.target.value
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Transfer Reason"
            labelFor="warranty-transfer-reason"
            required
            description={`${transferReason.length}/1500 characters`}
          >
            <Textarea
              id="warranty-transfer-reason"
              value={transferReason}
              rows={7}
              minLength={10}
              maxLength={1500}
              disabled={loading}
              placeholder="Explain the ownership change, sale, gift or other legitimate transfer reason."
              onChange={(event) =>
                setTransferReason(
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
            loadingLabel="Transferring Warranty"
            onClick={() => {
              if (!warranty) {
                return;
              }

              void onSubmit({
                warrantyId:
                  warranty.id,
                newOwnerEmail:
                  newOwnerEmail
                    .trim()
                    .toLowerCase(),
                transferReason:
                  transferReason.trim(),
              });
            }}
          >
            <UserRoundCheck
              aria-hidden="true"
              className="size-4"
            />
            Transfer Ownership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
