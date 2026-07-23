"use client";

import {
  ExternalLink,
  PackageSearch,
  Truck,
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
import type {
  UpdateReturnTrackingInput,
} from "@/lib/schemas/return";
import type {
  ReturnRequest,
} from "@/types/return";

interface ReturnTrackingDialogProps {
  readonly open: boolean;
  readonly returnRequest: ReturnRequest | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: UpdateReturnTrackingInput
  ) => void | Promise<void>;
}

export function ReturnTrackingDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  returnRequest,
}: ReturnTrackingDialogProps): React.JSX.Element {
  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState("");

  const [
    trackingURL,
    setTrackingURL,
  ] = useState("");

  const [
    logisticsProvider,
    setLogisticsProvider,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setTrackingNumber(
      returnRequest?.pickup
        .trackingNumber ??
        ""
    );

    setTrackingURL(
      returnRequest?.pickup
        .trackingURL ??
        ""
    );

    setLogisticsProvider(
      returnRequest?.pickup
        .logisticsProvider ??
        ""
    );
  }, [
    open,
    returnRequest,
  ]);

  const validURL =
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
    Boolean(returnRequest) &&
    trackingNumber.trim()
      .length >= 3 &&
    logisticsProvider.trim()
      .length >= 2 &&
    validURL;

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
            Update Return Tracking
          </DialogTitle>

          <DialogDescription>
            Record the reverse-logistics tracking reference shared by
            the selected carrier.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title="Tracking details are customer-visible"
            description="Verify the carrier name, tracking number and public tracking link before publishing."
            icon={
              <PackageSearch
                aria-hidden={true}
                className="size-5"
              />
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
            </section>
          ) : null}

          <FormField
            label="Logistics Provider"
            labelFor="return-tracking-provider"
            required
          >
            <div className="relative">
              <Truck
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="return-tracking-provider"
                value={
                  logisticsProvider
                }
                maxLength={150}
                disabled={loading}
                className="pl-11"
                onChange={(event) =>
                  setLogisticsProvider(
                    event.target
                      .value
                  )
                }
              />
            </div>
          </FormField>

          <FormField
            label="Tracking Number"
            labelFor="return-tracking-number"
            required
          >
            <Input
              id="return-tracking-number"
              value={trackingNumber}
              maxLength={150}
              disabled={loading}
              className="font-mono uppercase"
              onChange={(event) =>
                setTrackingNumber(
                  event.target.value.toUpperCase()
                )
              }
            />
          </FormField>

          <FormField
            label="Public Tracking URL"
            labelFor="return-tracking-url"
            optional
            error={
              validURL
                ? undefined
                : "Enter a valid tracking URL."
            }
          >
            <div className="relative">
              <ExternalLink
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="return-tracking-url"
                type="url"
                value={trackingURL}
                disabled={loading}
                className="pl-11"
                invalid={!validURL}
                placeholder="https://carrier.example/track/..."
                onChange={(event) =>
                  setTrackingURL(
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
            loadingLabel="Updating Tracking"
            onClick={() => {
              if (
                !returnRequest
              ) {
                return;
              }

              void onSubmit({
                returnId:
                  returnRequest.id,
                trackingNumber:
                  trackingNumber.trim(),
                trackingURL:
                  trackingURL.trim() ||
                  undefined,
                logisticsProvider:
                  logisticsProvider.trim(),
              });
            }}
          >
            <PackageSearch
              aria-hidden={true}
              className="size-4"
            />
            Update Tracking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
