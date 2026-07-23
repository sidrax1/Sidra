"use client";

import {
  MapPin,
  ShieldAlert,
  Trash2,
} from "lucide-react";

import {
  type CustomerAddress,
} from "@/components/addresses/AddressCard";
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

interface AddressDeleteDialogProps {
  readonly open: boolean;
  readonly address: CustomerAddress | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    addressId: string
  ) => void | Promise<void>;
}

export function AddressDeleteDialog({
  address,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
}: AddressDeleteDialogProps): React.JSX.Element {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Delete Address
          </DialogTitle>

          <DialogDescription>
            Remove this saved address from your Sidra account.
          </DialogDescription>
        </DialogHeader>

        {address?.isDefault ? (
          <Alert
            variant="warning"
            title="This is your default address"
            description="Choose another default address after deletion before your next checkout."
            icon={
              <ShieldAlert
                aria-hidden="true"
                className="size-5"
              />
            }
          />
        ) : null}

        {address ? (
          <div className="flex items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-5">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--color-gold-600)]"
            />

            <div>
              <h3 className="font-medium text-foreground">
                {address.fullName}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                {address.line1},{" "}
                {address.city},{" "}
                {address.state}{" "}
                {address.postalCode}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep Address
          </Button>

          <Button
            variant="danger"
            disabled={!address}
            loading={loading}
            loadingLabel="Deleting Address"
            onClick={() => {
              if (address) {
                void onConfirm(
                  address.id
                );
              }
            }}
          >
            <Trash2
              aria-hidden="true"
              className="size-4"
            />
            Delete Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
