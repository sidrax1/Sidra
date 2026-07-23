"use client";

import {
  ExternalLink,
  PackageSearch,
  ShieldCheck,
  Truck,
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
  UpdateWarrantyTrackingInput,
} from "@/lib/schemas/warranty";
import type {
  WarrantyClaim,
} from "@/types/warranty";

interface WarrantyTrackingDialogProps {
  readonly open: boolean;
  readonly claim: WarrantyClaim | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: UpdateWarrantyTrackingInput
  ) => void | Promise<void>;
}

export function WarrantyTrackingDialog({
  claim,
  loading = false,
  onOpenChange,
  onSubmit,
  open,
}: WarrantyTrackingDialogProps): React.JSX.Element {
  const [
    logisticsProvider,
    setLogisticsProvider,
  ] = useState("");

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");

  const [
    trackingURL,
    setTrackingURL,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setLogisticsProvider(
      claim?.serviceAppointment
        ?.logisticsProvider ?? ""
    );

    setTrackingNumber(
      claim?.serviceAppointment
        ?.trackingNumber ?? ""
    );

    setTrackingURL(
      claim?.serviceAppointment
        ?.trackingURL ?? ""
    );
  }, [
    claim,
    open,
  ]);

  const validTrackingURL =
    trackingURL.trim()
      .length === 0 ||
    (() => {
      try {
        const url = new URL(
          trackingURL.trim()
        );

        return (
          url.protocol ===
            "https:" ||
          url.protocol ===
            "http:"
        );
      } catch {
        return false;
      }
    })();

  const valid =
    Boolean(claim) &&
    logisticsProvider.trim()
      .length >= 2 &&
    trackingNumber.trim()
      .length >= 3 &&
    validTrackingURL;

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
            Update Warranty Tracking
          </DialogTitle>

          <DialogDescription>
            Publish reverse-logistics or replacement shipment
            tracking details for the warranty claim.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title="Tracking information is customer-visible"
            description="Verify the provider reference and public tracking link before publishing."
            icon={
              <ShieldCheck
                aria-hidden="true"
                className="size-5"
              />
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

              <p className="mt-2 text-sm text-muted">
                {
                  claim.product
                    .productTitle
                }
              </p>
            </section>
          ) : null}

          <FormField
            label="Logistics Provider"
            labelFor="warranty-tracking-provider"
            required
          >
            <div className="relative">
              <Truck
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="warranty-tracking-provider"
                value={
                  logisticsProvider
                }
                maxLength={180}
                disabled={loading}
                className="pl-11"
                onChange={(event) =>
                  setLogisticsProvider(
                    event.target.value
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Tracking Number"
            labelFor="warranty-tracking-number"
            required
          >
            <div className="relative">
              <PackageSearch
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="warranty-tracking-number"
                value={trackingNumber}
                maxLength={180}
                disabled={loading}
                className="pl-11 font-mono uppercase"
                onChange={(event) =>
                  setTrackingNumber(
                    event.target.value.toUpperCase()
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Public Tracking URL"
            labelFor="warranty-tracking-url"
            optional
            error={
              validTrackingURL
                ? undefined
                : "Enter a valid HTTP or HTTPS tracking URL."
            }
          >
            <div className="relative">
              <ExternalLink
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="warranty-tracking-url"
                type="url"
                value={trackingURL}
                disabled={loading}
                invalid={
                  !validTrackingURL
                }
                className="pl-11"
                placeholder="https://carrier.example/track/..."
                onChange={(event) =>
                  setTrackingURL(
                    event.target.value
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
            loadingLabel="Updating Tracking"
            onClick={() => {
              if (!claim) {
                return;
              }

              void onSubmit({
                claimId: claim.id,
                logisticsProvider:
                  logisticsProvider.trim(),
                trackingNumber:
                  trackingNumber.trim(),
                trackingURL:
                  trackingURL.trim() ||
                  undefined,
              });
            }}
          >
            <PackageSearch
              aria-hidden="true"
              className="size-4"
            />
            Update Tracking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
