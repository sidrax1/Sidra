"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  BadgeIndianRupee,
  CalendarClock,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import { formatCurrency } from "@/lib/currency";
import type { CustomOrderQuoteInput } from "@/lib/schemas/custom-order-workflow";

interface CustomOrderQuoteFormProps {
  readonly customOrderId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: CustomOrderQuoteInput
  ) => void | Promise<void>;
  readonly onCancel?: () => void;
}

interface QuoteFormValues {
  readonly amountRupees: number;
  readonly shippingRupees: number;
  readonly taxRupees: number;
  readonly estimatedProductionDays: number;
  readonly validUntil: string;
  readonly notes: string;
  readonly terms: string;
}

function toLocalDateInput(date: Date): string {
  const timezoneOffset =
    date.getTimezoneOffset() * 60_000;

  return new Date(
    date.getTime() - timezoneOffset
  )
    .toISOString()
    .slice(0, 16);
}

export function CustomOrderQuoteForm({
  customOrderId,
  loading = false,
  onCancel,
  onSubmit,
}: CustomOrderQuoteFormProps): React.JSX.Element {
  const minimumValidUntil = useMemo(
    () =>
      toLocalDateInput(
        new Date(Date.now() + 60 * 60 * 1000)
      ),
    []
  );

  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    watch,
  } = useForm<QuoteFormValues>({
    defaultValues: {
      amountRupees: 0,
      shippingRupees: 0,
      taxRupees: 0,
      estimatedProductionDays: 7,
      validUntil: minimumValidUntil,
      notes: "",
      terms:
        "Production begins after verified payment and final design approval. The finished piece may contain minor handmade variations that do not affect quality or approved specifications.",
    },
  });

  const amountRupees =
    watch("amountRupees") || 0;

  const shippingRupees =
    watch("shippingRupees") || 0;

  const taxRupees =
    watch("taxRupees") || 0;

  const totalRupees =
    amountRupees +
    shippingRupees +
    taxRupees;

  return (
    <Surface className="grid gap-7" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <BadgeIndianRupee
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Commercial Proposal
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Prepare Custom Quote
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Provide transparent pricing, a realistic production
            timeline and clear commercial terms.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            customOrderId,
            amountPaise: Math.round(
              values.amountRupees * 100
            ),
            shippingFeePaise: Math.round(
              values.shippingRupees * 100
            ),
            taxPaise: Math.round(
              values.taxRupees * 100
            ),
            estimatedProductionDays:
              values.estimatedProductionDays,
            validUntil: new Date(
              values.validUntil
            ).toISOString(),
            notes:
              values.notes.trim() ||
              undefined,
            terms:
              values.terms.trim() ||
              undefined,
          });
        })}
      >
        <div className="grid gap-5 md:grid-cols-3">
          <FormField
            label="Crafting Amount"
            labelFor="quote-amount"
            required
            error={errors.amountRupees?.message}
          >
            <Input
              id="quote-amount"
              type="number"
              min={1}
              step="0.01"
              disabled={loading}
              {...register("amountRupees", {
                required:
                  "Crafting amount is required.",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message:
                    "Crafting amount must be greater than zero.",
                },
              })}
            />
          </FormField>

          <FormField
            label="Shipping"
            labelFor="quote-shipping"
            required
            error={errors.shippingRupees?.message}
          >
            <Input
              id="quote-shipping"
              type="number"
              min={0}
              step="0.01"
              disabled={loading}
              {...register("shippingRupees", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message:
                    "Shipping cannot be negative.",
                },
              })}
            />
          </FormField>

          <FormField
            label="Tax"
            labelFor="quote-tax"
            required
            error={errors.taxRupees?.message}
          >
            <Input
              id="quote-tax"
              type="number"
              min={0}
              step="0.01"
              disabled={loading}
              {...register("taxRupees", {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message:
                    "Tax cannot be negative.",
                },
              })}
            />
          </FormField>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.32)] bg-[color:rgb(200_169_106_/_0.07)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Quote Total
          </p>

          <p className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            {formatCurrency(totalRupees)}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Production Timeline"
            labelFor="quote-production-days"
            required
            error={
              errors.estimatedProductionDays?.message
            }
          >
            <div className="relative">
              <CalendarClock
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
              />

              <Input
                id="quote-production-days"
                type="number"
                min={1}
                max={365}
                step={1}
                disabled={loading}
                className="pl-11"
                {...register(
                  "estimatedProductionDays",
                  {
                    required:
                      "Production timeline is required.",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message:
                        "Timeline must be at least one day.",
                    },
                    max: {
                      value: 365,
                      message:
                        "Timeline cannot exceed 365 days.",
                    },
                  }
                )}
              />
            </div>
          </FormField>

          <FormField
            label="Valid Until"
            labelFor="quote-valid-until"
            required
            error={errors.validUntil?.message}
          >
            <Input
              id="quote-valid-until"
              type="datetime-local"
              min={minimumValidUntil}
              disabled={loading}
              {...register("validUntil", {
                required:
                  "Quote validity is required.",
              })}
            />
          </FormField>
        </div>

        <FormField
          label="Studio Notes"
          labelFor="quote-notes"
          optional
        >
          <div className="relative">
            <FileText
              aria-hidden={true}
              className="pointer-events-none absolute left-4 top-4 size-4 text-muted"
            />

            <Textarea
              id="quote-notes"
              rows={6}
              disabled={loading}
              maxLength={3000}
              className="pl-11"
              {...register("notes")}
            />
          </div>
        </FormField>

        <FormField
          label="Commercial Terms"
          labelFor="quote-terms"
          optional
        >
          <Textarea
            id="quote-terms"
            rows={6}
            disabled={loading}
            maxLength={3000}
            {...register("terms")}
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}

          <Button
            type="submit"
            disabled={
              !isDirty ||
              amountRupees <= 0 ||
              totalRupees <= 0
            }
            loading={loading}
            loadingLabel="Sending Quote"
          >
            Send Formal Quote
          </Button>
        </div>
      </form>
    </Surface>
  );
}
