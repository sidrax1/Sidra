"use client";

import {
  BadgeCheck,
  Hash,
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
  Input,
} from "@/components/ui/Input";
import type {
  RegisterWarrantyInput,
} from "@/lib/schemas/warranty";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyRegistrationDialogProps {
  readonly open: boolean;
  readonly warranty: ProductWarranty | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: RegisterWarrantyInput
  ) => void | Promise<void>;
}

export function WarrantyRegistrationDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  warranty,
}: WarrantyRegistrationDialogProps): React.JSX.Element {
  const [
    serialNumber,
    setSerialNumber,
  ] = useState("");

  const [
    registrationReference,
    setRegistrationReference,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setSerialNumber(
      warranty?.product
        .serialNumber ?? ""
    );

    setRegistrationReference(
      warranty?.registrationReference ??
        ""
    );
  }, [
    open,
    warranty,
  ]);

  const registrationRequired =
    warranty?.registrationRequired ??
    false;

  const alreadyRegistered =
    Boolean(
      warranty?.registeredAt
    );

  const valid =
    Boolean(warranty) &&
    !alreadyRegistered &&
    (!registrationRequired ||
      serialNumber.trim()
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
            Register Product Warranty
          </DialogTitle>

          <DialogDescription>
            Verify product ownership and activate registration-dependent
            warranty coverage.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              alreadyRegistered
                ? "success"
                : "warning"
            }
            title={
              alreadyRegistered
                ? "Warranty is already registered"
                : "Registration unlocks protected claims"
            }
            description={
              alreadyRegistered
                ? "This warranty has already completed the registration workflow."
                : "Serial numbers and registration references are verified by trusted server-side functions."
            }
            icon={
              alreadyRegistered ? (
                <BadgeCheck
                  aria-hidden={true}
                  className="size-5"
                />
              ) : (
                <ShieldCheck
                  aria-hidden={true}
                  className="size-5"
                />
              )
            }
          />

          {warranty ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                Warranty #
                {warranty.warrantyNumber}
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {
                  warranty.product
                    .productTitle
                }
              </h3>

              <div className="mt-4 grid gap-2 text-xs text-muted">
                <span>
                  Order #
                  {
                    warranty.product
                      .orderNumber
                  }
                </span>

                <span>
                  Owner:{" "}
                  {
                    warranty.owner
                      .customerEmail
                  }
                </span>
              </div>
            </section>
          ) : null}

          <FormField
            label="Product Serial Number"
            labelFor="warranty-registration-serial"
            required={
              registrationRequired
            }
            optional={
              !registrationRequired
            }
            description="Enter the serial number exactly as printed on the product or authenticity card."
          >
            <div className="relative">
              <Hash
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="warranty-registration-serial"
                value={serialNumber}
                maxLength={150}
                disabled={
                  loading ||
                  alreadyRegistered
                }
                className="pl-11 font-mono uppercase"
                placeholder="SIDRA-RESIN-2026-0001"
                onChange={(event) =>
                  setSerialNumber(
                    event.target.value.toUpperCase()
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Registration Reference"
            labelFor="warranty-registration-reference"
            optional
            description="Add the authenticity card, studio certificate or external registration reference when available."
          >
            <Input
              id="warranty-registration-reference"
              value={
                registrationReference
              }
              maxLength={200}
              disabled={
                loading ||
                alreadyRegistered
              }
              className="font-mono"
              onChange={(event) =>
                setRegistrationReference(
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
            Close
          </Button>

          {!alreadyRegistered ? (
            <Button
              disabled={!valid}
              loading={loading}
              loadingLabel="Registering Warranty"
              onClick={() => {
                if (!warranty) {
                  return;
                }

                void onSubmit({
                  warrantyId:
                    warranty.id,
                  serialNumber:
                    serialNumber.trim() ||
                    undefined,
                  registrationReference:
                    registrationReference.trim() ||
                    undefined,
                });
              }}
            >
              <ShieldCheck
                aria-hidden={true}
                className="size-4"
              />
              Register Warranty
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
