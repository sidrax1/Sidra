"use client";

import { useMemo } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  Gift,
  Mail,
  Send,
} from "lucide-react";

import { GiftCardDesignSelector } from "@/components/gift-cards/GiftCardDesignSelector";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import {
  purchaseGiftCardSchema,
  type PurchaseGiftCardInput,
} from "@/lib/schemas/gift-card";
import type { GiftCardDesign } from "@/types/gift-card";

interface GiftCardPurchaseFormProps {
  readonly designs: readonly GiftCardDesign[];
  readonly loading?: boolean;
  readonly onSubmit: (
    input: PurchaseGiftCardInput
  ) => void | Promise<void>;
}

const valueOptions = [
  {
    value: "50000",
    label: "₹500",
  },
  {
    value: "100000",
    label: "₹1,000",
  },
  {
    value: "200000",
    label: "₹2,000",
  },
  {
    value: "500000",
    label: "₹5,000",
  },
  {
    value: "1000000",
    label: "₹10,000",
  },
] as const;

const deliveryOptions = [
  {
    value: "immediate",
    label: "Send Immediately",
  },
  {
    value: "scheduled",
    label: "Schedule Delivery",
  },
] as const;

function localDateTimeToISO(
  value: string
): string | undefined {
  return value
    ? new Date(value).toISOString()
    : undefined;
}

export function GiftCardPurchaseForm({
  designs,
  loading = false,
  onSubmit,
}: GiftCardPurchaseFormProps): React.JSX.Element {
  const defaultDesignId =
    designs.at(0)?.id ?? "";

  const minimumSchedule = useMemo(() => {
    return new Date(
      Date.now() + 60 * 60 * 1000
    )
      .toISOString()
      .slice(0, 16);
  }, []);

  const {
    control,
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } = useForm<PurchaseGiftCardInput>({
    resolver: zodResolver(purchaseGiftCardSchema),
    mode: "onChange",
    defaultValues: {
      valuePaise: 100000,
      recipientName: "",
      recipientEmail: "",
      message: "",
      designId: defaultDesignId,
      deliveryMode: "immediate",
      scheduledDeliveryAt: undefined,
    },
  });

  const deliveryMode = watch("deliveryMode");
  const selectedDesignId = watch("designId");

  return (
    <Surface className="grid gap-8" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Gift
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Digital Gifting
          </p>

          <h2 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            Send a Sydra Gift Card
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Create a protected digital gift redeemable across
            eligible Sydra collections.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="designId"
          render={({ field }) => (
            <GiftCardDesignSelector
              designs={designs}
              selectedDesignId={
                field.value || selectedDesignId
              }
              disabled={loading}
              onChange={field.onChange}
            />
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Gift Value"
            labelFor="gift-card-value"
            required
            error={errors.valuePaise?.message}
          >
            <Select
              id="gift-card-value"
              options={valueOptions}
              disabled={loading}
              {...register("valuePaise", {
                valueAsNumber: true,
              })}
            />
          </FormField>

          <FormField
            label="Delivery"
            labelFor="gift-card-delivery"
            required
          >
            <Select
              id="gift-card-delivery"
              options={deliveryOptions}
              disabled={loading}
              {...register("deliveryMode")}
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Recipient Name"
            labelFor="gift-card-recipient-name"
            required
            error={errors.recipientName?.message}
          >
            <Input
              id="gift-card-recipient-name"
              disabled={loading}
              autoComplete="name"
              {...register("recipientName")}
            />
          </FormField>

          <FormField
            label="Recipient Email"
            labelFor="gift-card-recipient-email"
            required
            error={errors.recipientEmail?.message}
          >
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="gift-card-recipient-email"
                type="email"
                disabled={loading}
                autoComplete="email"
                className="pl-11"
                {...register("recipientEmail")}
              />
            </div>
          </FormField>
        </div>

        <FormField
          label="Personal Message"
          labelFor="gift-card-message"
          optional
          description="Maximum 500 characters."
          error={errors.message?.message}
        >
          <Textarea
            id="gift-card-message"
            rows={6}
            disabled={loading}
            maxLength={500}
            {...register("message")}
          />
        </FormField>

        {deliveryMode === "scheduled" ? (
          <FormField
            label="Scheduled Delivery"
            labelFor="gift-card-schedule"
            required
            error={
              errors.scheduledDeliveryAt?.message
            }
          >
            <Controller
              control={control}
              name="scheduledDeliveryAt"
              render={({ field }) => (
                <div className="relative">
                  <CalendarClock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                  />

                  <Input
                    id="gift-card-schedule"
                    type="datetime-local"
                    min={minimumSchedule}
                    disabled={loading}
                    className="pl-11"
                    value={
                      field.value
                        ? new Date(field.value)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        localDateTimeToISO(
                          event.target.value
                        )
                      )
                    }
                  />
                </div>
              )}
            />
          </FormField>
        ) : null}

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={!isValid}
            loading={loading}
            loadingLabel="Preparing Gift Card"
          >
            <Send
              aria-hidden="true"
              className="size-4"
            />
            Continue to Payment
          </Button>
        </div>
      </form>
    </Surface>
  );
}
