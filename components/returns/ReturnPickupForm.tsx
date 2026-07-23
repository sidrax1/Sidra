"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { CalendarClock, Truck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import type { ReturnPickupInput } from "@/lib/schemas/return";

interface ReturnPickupFormProps {
  readonly returnRequestId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: ReturnPickupInput
  ) => void | Promise<void>;
}

interface PickupFormValues {
  readonly carrier: string;
  readonly trackingNumber: string;
  readonly trackingURL: string;
  readonly pickupDate: string;
}

export function ReturnPickupForm({
  loading = false,
  onSubmit,
  returnRequestId,
}: ReturnPickupFormProps): React.JSX.Element {
  const minimumDate = useMemo(() => {
    const date = new Date(Date.now() + 60 * 60 * 1000);
    return date.toISOString().slice(0, 16);
  }, []);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<PickupFormValues>({
    defaultValues: {
      carrier: "",
      trackingNumber: "",
      trackingURL: "",
      pickupDate: minimumDate,
    },
  });

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Truck className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Reverse Logistics
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Schedule Return Pickup
          </h2>
        </div>
      </header>

      <form
        className="grid gap-5"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            returnRequestId,
            carrier: values.carrier.trim(),
            trackingNumber: values.trackingNumber.trim(),
            trackingURL:
              values.trackingURL.trim() || undefined,
            pickupDate: new Date(
              values.pickupDate
            ).toISOString(),
          });
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Carrier"
            labelFor="return-carrier"
            required
            error={errors.carrier?.message}
          >
            <Input
              id="return-carrier"
              disabled={loading}
              {...register("carrier", {
                required: "Carrier is required.",
                minLength: 2,
              })}
            />
          </FormField>

          <FormField
            label="Tracking Number"
            labelFor="return-tracking-number"
            required
            error={errors.trackingNumber?.message}
          >
            <Input
              id="return-tracking-number"
              disabled={loading}
              {...register("trackingNumber", {
                required: "Tracking number is required.",
                minLength: 3,
              })}
            />
          </FormField>
        </div>

        <FormField
          label="Tracking URL"
          labelFor="return-tracking-url"
          optional
        >
          <Input
            id="return-tracking-url"
            type="url"
            disabled={loading}
            {...register("trackingURL")}
          />
        </FormField>

        <FormField
          label="Pickup Date"
          labelFor="return-pickup-date"
          required
        >
          <div className="relative">
            <CalendarClock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />

            <Input
              id="return-pickup-date"
              type="datetime-local"
              min={minimumDate}
              disabled={loading}
              className="pl-11"
              {...register("pickupDate", {
                required: true,
              })}
            />
          </div>
        </FormField>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            loading={loading}
            loadingLabel="Scheduling Pickup"
          >
            Schedule Pickup
          </Button>
        </div>
      </form>
    </Surface>
  );
}
