"use client";

import {
  CalendarClock,
  MapPin,
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
import { Select } from "@/components/ui/Select";
import type {
  ScheduleReturnPickupInput,
} from "@/lib/schemas/return";
import type {
  ReturnAddress,
  ReturnRequest,
} from "@/types/return";

interface ReturnPickupDialogProps {
  readonly open: boolean;
  readonly returnRequest: ReturnRequest | null;
  readonly logisticsProviders: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: ScheduleReturnPickupInput
  ) => void | Promise<void>;
}

const emptyAddress: ReturnAddress = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  postalCode: "",
  countryCode: "IN",
};

function toLocalDateTime(
  value?: string
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offset =
    date.getTimezoneOffset() *
    60_000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export function ReturnPickupDialog({
  loading = false,
  logisticsProviders,
  onOpenChange,
  onSubmit,
  open,
  returnRequest,
}: ReturnPickupDialogProps): React.JSX.Element {
  const [
    pickupScheduledAt,
    setPickupScheduledAt,
  ] = useState("");

  const [
    logisticsProvider,
    setLogisticsProvider,
  ] = useState("");

  const [address, setAddress] =
    useState<ReturnAddress>(
      emptyAddress
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    setPickupScheduledAt(
      toLocalDateTime(
        returnRequest?.pickup
          .pickupScheduledAt
      )
    );

    setLogisticsProvider(
      returnRequest?.pickup
        .logisticsProvider ??
        logisticsProviders.at(0)
          ?.value ??
        ""
    );

    setAddress(
      returnRequest?.pickup
        .address ??
        emptyAddress
    );
  }, [
    logisticsProviders,
    open,
    returnRequest,
  ]);

  function updateAddress<
    Key extends keyof ReturnAddress,
  >(
    key: Key,
    value: ReturnAddress[Key]
  ): void {
    setAddress((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const valid =
    Boolean(returnRequest) &&
    pickupScheduledAt.length >
      0 &&
    logisticsProvider.trim()
      .length > 1 &&
    address.fullName.trim()
      .length >= 2 &&
    /^[6-9]\d{9}$/.test(
      address.phoneNumber
    ) &&
    address.addressLine1.trim()
      .length >= 5 &&
    address.city.trim().length >=
      2 &&
    address.state.trim().length >=
      2 &&
    /^[1-9][0-9]{5}$/.test(
      address.postalCode
    ) &&
    new Date(
      pickupScheduledAt
    ).getTime() > Date.now();

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[94vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Schedule Return Pickup
          </DialogTitle>

          <DialogDescription>
            Configure the verified pickup address, logistics partner
            and collection schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title="Pickup scheduling is protected"
            description="The selected logistics provider and pickup schedule are recorded server-side and shared with the customer."
            icon={
              <Truck
                aria-hidden="true"
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

              <p className="mt-2 text-sm text-muted">
                Pickup quantity:{" "}
                {
                  returnRequest.item
                    .returnQuantity
                }
              </p>
            </section>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Logistics Provider"
              labelFor="return-logistics-provider"
              required
            >
              <Select
                id="return-logistics-provider"
                value={
                  logisticsProvider
                }
                options={
                  logisticsProviders
                }
                disabled={
                  loading
                }
                onChange={(event) =>
                  setLogisticsProvider(
                    event.target
                      .value
                  )
                }
              />
            </FormField>

            <FormField
              label="Pickup Schedule"
              labelFor="return-pickup-schedule"
              required
            >
              <div className="relative">
                <CalendarClock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                />

                <Input
                  id="return-pickup-schedule"
                  type="datetime-local"
                  value={
                    pickupScheduledAt
                  }
                  min={new Date(
                    Date.now() +
                      60 *
                        60 *
                        1000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  disabled={
                    loading
                  }
                  className="pl-11"
                  onChange={(event) =>
                    setPickupScheduledAt(
                      event.target
                        .value
                    )
                  }
                />
              </div>
            </FormField>
          </div>

          <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <MapPin
                aria-hidden="true"
                className="size-5 text-[var(--color-gold-600)]"
              />

              <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                Pickup Address
              </h3>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Full Name"
                labelFor="return-pickup-name"
                required
              >
                <Input
                  id="return-pickup-name"
                  value={
                    address.fullName
                  }
                  disabled={
                    loading
                  }
                  onChange={(event) =>
                    updateAddress(
                      "fullName",
                      event.target
                        .value
                    )
                  }
                />
              </FormField>

              <FormField
                label="Phone Number"
                labelFor="return-pickup-phone"
                required
              >
                <Input
                  id="return-pickup-phone"
                  type="tel"
                  value={
                    address.phoneNumber
                  }
                  inputMode="numeric"
                  maxLength={10}
                  disabled={
                    loading
                  }
                  onChange={(event) =>
                    updateAddress(
                      "phoneNumber",
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />
              </FormField>
            </div>

            <FormField
              label="Address Line 1"
              labelFor="return-pickup-address-1"
              required
            >
              <Input
                id="return-pickup-address-1"
                value={
                  address.addressLine1
                }
                disabled={loading}
                onChange={(event) =>
                  updateAddress(
                    "addressLine1",
                    event.target.value
                  )
                }
              />
            </FormField>

            <FormField
              label="Address Line 2"
              labelFor="return-pickup-address-2"
              optional
            >
              <Input
                id="return-pickup-address-2"
                value={
                  address.addressLine2 ??
                  ""
                }
                disabled={loading}
                onChange={(event) =>
                  updateAddress(
                    "addressLine2",
                    event.target.value
                  )
                }
              />
            </FormField>

            <FormField
              label="Landmark"
              labelFor="return-pickup-landmark"
              optional
            >
              <Input
                id="return-pickup-landmark"
                value={
                  address.landmark ??
                  ""
                }
                disabled={loading}
                onChange={(event) =>
                  updateAddress(
                    "landmark",
                    event.target.value
                  )
                }
              />
            </FormField>

            <div className="grid gap-5 md:grid-cols-3">
              <FormField
                label="City"
                labelFor="return-pickup-city"
                required
              >
                <Input
                  id="return-pickup-city"
                  value={
                    address.city
                  }
                  disabled={
                    loading
                  }
                  onChange={(event) =>
                    updateAddress(
                      "city",
                      event.target
                        .value
                    )
                  }
                />
              </FormField>

              <FormField
                label="State"
                labelFor="return-pickup-state"
                required
              >
                <Input
                  id="return-pickup-state"
                  value={
                    address.state
                  }
                  disabled={
                    loading
                  }
                  onChange={(event) =>
                    updateAddress(
                      "state",
                      event.target
                        .value
                    )
                  }
                />
              </FormField>

              <FormField
                label="Postal Code"
                labelFor="return-pickup-postal-code"
                required
              >
                <Input
                  id="return-pickup-postal-code"
                  value={
                    address.postalCode
                  }
                  inputMode="numeric"
                  maxLength={6}
                  disabled={
                    loading
                  }
                  onChange={(event) =>
                    updateAddress(
                      "postalCode",
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                />
              </FormField>
            </div>
          </section>
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
            loadingLabel="Scheduling Pickup"
            onClick={() => {
              if (
                !returnRequest
              ) {
                return;
              }

              void onSubmit({
                returnId:
                  returnRequest.id,
                pickupAddress:
                  address,
                pickupScheduledAt:
                  new Date(
                    pickupScheduledAt
                  ).toISOString(),
                logisticsProvider:
                  logisticsProvider.trim(),
              });
            }}
          >
            <Truck
              aria-hidden="true"
              className="size-4"
            />
            Schedule Pickup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
