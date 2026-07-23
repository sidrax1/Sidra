"use client";

import {
  CalendarClock,
  MapPin,
  Truck,
  Wrench,
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
  Select,
} from "@/components/ui/Select";
import type {
  WarrantyServiceAppointmentInput,
} from "@/lib/schemas/warranty";
import type {
  WarrantyClaim,
  WarrantyServiceAddress,
} from "@/types/warranty";

interface WarrantyServiceAppointmentDialogProps {
  readonly open: boolean;
  readonly claim: WarrantyClaim | null;
  readonly defaultAddress?: WarrantyServiceAddress;
  readonly servicePartners?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly logisticsProviders?: readonly {
    readonly value: string;
    readonly label: string;
  }[];
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: WarrantyServiceAppointmentInput
  ) => void | Promise<void>;
}

const serviceModeOptions = [
  {
    value: "pickup",
    label: "Pickup Service",
  },
  {
    value: "dropOff",
    label: "Customer Drop-off",
  },
  {
    value: "onSite",
    label: "On-site Service",
  },
  {
    value: "remoteAssessment",
    label: "Remote Assessment",
  },
] as const;

const emptyAddress: WarrantyServiceAddress =
  {
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

export function WarrantyServiceAppointmentDialog({
  claim,
  defaultAddress,
  loading = false,
  logisticsProviders = [],
  onOpenChange,
  onSubmit,
  open,
  servicePartners = [],
}: WarrantyServiceAppointmentDialogProps): React.JSX.Element {
  const [
    serviceMode,
    setServiceMode,
  ] =
    useState<
      WarrantyServiceAppointmentInput["serviceMode"]
    >("pickup");

  const [
    scheduledAt,
    setScheduledAt,
  ] = useState("");

  const [
    servicePartnerId,
    setServicePartnerId,
  ] = useState("");

  const [
    servicePartnerName,
    setServicePartnerName,
  ] = useState("");

  const [
    logisticsProvider,
    setLogisticsProvider,
  ] = useState("");

  const [address, setAddress] =
    useState<
      WarrantyServiceAddress
    >(
      defaultAddress ??
        emptyAddress
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    setServiceMode(
      claim?.serviceAppointment
        ?.serviceMode ?? "pickup"
    );

    setScheduledAt(
      toLocalDateTime(
        claim?.serviceAppointment
          ?.scheduledAt
      )
    );

    setServicePartnerId(
      claim?.serviceAppointment
        ?.servicePartnerId ??
        servicePartners.at(0)
          ?.value ??
        ""
    );

    setServicePartnerName(
      claim?.serviceAppointment
        ?.servicePartnerName ??
        servicePartners.at(0)
          ?.label ??
        ""
    );

    setLogisticsProvider(
      claim?.serviceAppointment
        ?.logisticsProvider ??
        logisticsProviders.at(0)
          ?.value ??
        ""
    );

    setAddress(
      claim?.serviceAppointment
        ?.address ??
        defaultAddress ??
        emptyAddress
    );
  }, [
    claim,
    defaultAddress,
    logisticsProviders,
    open,
    servicePartners,
  ]);

  function updateAddress<
    Key extends keyof WarrantyServiceAddress,
  >(
    key: Key,
    value: WarrantyServiceAddress[Key]
  ): void {
    setAddress((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const addressRequired =
    serviceMode === "pickup" ||
    serviceMode === "onSite";

  const logisticsRequired =
    serviceMode === "pickup";

  const validAddress =
    !addressRequired ||
    (address.fullName.trim()
      .length >= 2 &&
      /^[6-9]\d{9}$/.test(
        address.phoneNumber
      ) &&
      address.addressLine1
        .trim().length >= 5 &&
      address.city.trim()
        .length >= 2 &&
      address.state.trim()
        .length >= 2 &&
      /^[1-9][0-9]{5}$/.test(
        address.postalCode
      ));

  const valid =
    Boolean(claim) &&
    scheduledAt.length > 0 &&
    new Date(
      scheduledAt
    ).getTime() > Date.now() &&
    validAddress &&
    (!logisticsRequired ||
      logisticsProvider.trim()
        .length >= 2);

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
            Schedule Warranty Service
          </DialogTitle>

          <DialogDescription>
            Configure the approved claim’s service mode, partner,
            location and appointment schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant="success"
            title="Appointment details are customer-visible"
            description="The schedule and service instructions will be shared with the customer after server-side validation."
            icon={
              <Wrench
                aria-hidden={true}
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
                Approved resolution:{" "}
                {claim.decision
                  ?.resolution.replace(
                    /([A-Z])/g,
                    " $1"
                  ) ??
                  "Not recorded"}
              </p>
            </section>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Service Mode"
              labelFor="warranty-service-mode"
              required
            >
              <Select
                id="warranty-service-mode"
                value={serviceMode}
                options={
                  serviceModeOptions
                }
                disabled={loading}
                onChange={(event) =>
                  setServiceMode(
                    event.target
                      .value as WarrantyServiceAppointmentInput["serviceMode"]
                  )
                }
              />
            </FormField>

            <FormField
              label="Appointment Schedule"
              labelFor="warranty-service-schedule"
              required
            >
              <div className="relative">
                <CalendarClock
                  aria-hidden={true}
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                />

                <Input
                  id="warranty-service-schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  disabled={loading}
                  className="pl-11"
                  onChange={(event) =>
                    setScheduledAt(
                      event.target.value
                    )
                  }
                />
              </div>
            </FormField>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Service Partner"
              labelFor="warranty-service-partner"
              optional
            >
              {servicePartners.length >
              0 ? (
                <Select
                  id="warranty-service-partner"
                  value={
                    servicePartnerId
                  }
                  options={[
                    {
                      value: "",
                      label:
                        "Assign Later",
                    },
                    ...servicePartners,
                  ]}
                  disabled={loading}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setServicePartnerId(
                      value
                    );

                    setServicePartnerName(
                      servicePartners.find(
                        (partner) =>
                          partner.value ===
                          value
                      )?.label ?? ""
                    );
                  }}
                />
              ) : (
                <Input
                  id="warranty-service-partner"
                  value={
                    servicePartnerName
                  }
                  disabled={loading}
                  maxLength={180}
                  onChange={(event) =>
                    setServicePartnerName(
                      event.target.value
                    )
                  }
                />
              )}
            </FormField>

            {logisticsRequired ? (
              <FormField
                label="Logistics Provider"
                labelFor="warranty-logistics-provider"
                required
              >
                {logisticsProviders.length >
                0 ? (
                  <Select
                    id="warranty-logistics-provider"
                    value={
                      logisticsProvider
                    }
                    options={
                      logisticsProviders
                    }
                    disabled={loading}
                    onChange={(event) =>
                      setLogisticsProvider(
                        event.target.value
                      )
                    }
                  />
                ) : (
                  <div className="relative">
                    <Truck
                      aria-hidden={true}
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                    />

                    <Input
                      id="warranty-logistics-provider"
                      value={
                        logisticsProvider
                      }
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
                )}
              </FormField>
            ) : null}
          </div>

          {addressRequired ? (
            <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <MapPin
                  aria-hidden={true}
                  className="size-5 text-[var(--color-gold-600)]"
                />

                <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                  Service Address
                </h3>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField
                  label="Full Name"
                  labelFor="warranty-service-name"
                  required
                >
                  <Input
                    id="warranty-service-name"
                    value={
                      address.fullName
                    }
                    disabled={loading}
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
                  labelFor="warranty-service-phone"
                  required
                >
                  <Input
                    id="warranty-service-phone"
                    type="tel"
                    value={
                      address.phoneNumber
                    }
                    maxLength={10}
                    inputMode="numeric"
                    disabled={loading}
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
                labelFor="warranty-service-address-1"
                required
              >
                <Input
                  id="warranty-service-address-1"
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
                labelFor="warranty-service-address-2"
                optional
              >
                <Input
                  id="warranty-service-address-2"
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
                labelFor="warranty-service-landmark"
                optional
              >
                <Input
                  id="warranty-service-landmark"
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
                  labelFor="warranty-service-city"
                  required
                >
                  <Input
                    id="warranty-service-city"
                    value={address.city}
                    disabled={loading}
                    onChange={(event) =>
                      updateAddress(
                        "city",
                        event.target.value
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="State"
                  labelFor="warranty-service-state"
                  required
                >
                  <Input
                    id="warranty-service-state"
                    value={
                      address.state
                    }
                    disabled={loading}
                    onChange={(event) =>
                      updateAddress(
                        "state",
                        event.target.value
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Postal Code"
                  labelFor="warranty-service-postal-code"
                  required
                >
                  <Input
                    id="warranty-service-postal-code"
                    value={
                      address.postalCode
                    }
                    maxLength={6}
                    inputMode="numeric"
                    disabled={loading}
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
          ) : null}
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
            loadingLabel="Scheduling Service"
            onClick={() => {
              if (!claim) {
                return;
              }

              void onSubmit({
                claimId: claim.id,
                serviceMode,
                scheduledAt:
                  new Date(
                    scheduledAt
                  ).toISOString(),
                address:
                  addressRequired
                    ? address
                    : undefined,
                servicePartnerId:
                  servicePartnerId ||
                  undefined,
                servicePartnerName:
                  servicePartnerName.trim() ||
                  undefined,
                logisticsProvider:
                  logisticsRequired
                    ? logisticsProvider.trim()
                    : undefined,
              });
            }}
          >
            <Wrench
              aria-hidden={true}
              className="size-4"
            />
            Schedule Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
