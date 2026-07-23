"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgePercent,
  CalendarClock,
  Gift,
  Save,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/schemas/promotion";
import type { Promotion } from "@/types/promotion";

interface PromotionFormProps {
  readonly promotion?: Promotion;
  readonly loading?: boolean;
  readonly onCancel?: () => void;
  readonly onSubmit: (
    input: PromotionInput
  ) => void | Promise<void>;
}

const typeOptions = [
  {
    value: "percentage",
    label: "Percentage Discount",
  },
  {
    value: "fixedAmount",
    label: "Fixed Amount Discount",
  },
  {
    value: "freeShipping",
    label: "Free Shipping",
  },
  {
    value: "buyXGetY",
    label: "Buy X Get Y",
  },
] as const;

const audienceOptions = [
  {
    value: "allCustomers",
    label: "All Customers",
  },
  {
    value: "newCustomers",
    label: "New Customers",
  },
  {
    value: "returningCustomers",
    label: "Returning Customers",
  },
  {
    value: "selectedCustomers",
    label: "Selected Customers",
  },
] as const;

function toLocalDateTime(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function splitIdentifiers(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PromotionForm({
  loading = false,
  onCancel,
  onSubmit,
  promotion,
}: PromotionFormProps): React.JSX.Element {
  const defaultValues = useMemo<PromotionInput>(
    () => ({
      name: promotion?.name ?? "",
      description: promotion?.description ?? "",
      code: promotion?.code ?? "",
      type: promotion?.value.type ?? "percentage",
      percentageBasisPoints:
        promotion?.value.percentageBasisPoints ?? 1000,
      fixedAmountPaise:
        promotion?.value.fixedAmountPaise ?? undefined,
      buyQuantity:
        promotion?.value.buyQuantity ?? undefined,
      rewardQuantity:
        promotion?.value.rewardQuantity ?? undefined,
      audience:
        promotion?.eligibility.audience ??
        "allCustomers",
      minimumOrderPaise:
        promotion?.eligibility.minimumOrderPaise ??
        undefined,
      maximumDiscountPaise:
        promotion?.eligibility.maximumDiscountPaise ??
        undefined,
      productIds:
        promotion?.eligibility.productIds ?? [],
      categoryIds:
        promotion?.eligibility.categoryIds ?? [],
      studioIds:
        promotion?.eligibility.studioIds ?? [],
      customerIds:
        promotion?.eligibility.customerIds ?? [],
      firstOrderOnly:
        promotion?.eligibility.firstOrderOnly ?? false,
      totalUsageLimit:
        promotion?.usage.totalUsageLimit ?? undefined,
      usageLimitPerCustomer:
        promotion?.usage.usageLimitPerCustomer ?? 1,
      combinable: promotion?.combinable ?? false,
      automatic: promotion?.automatic ?? false,
      startsAt:
        promotion?.startsAt ?? new Date().toISOString(),
      endsAt: promotion?.endsAt,
    }),
    [promotion]
  );

  const {
    control,
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    watch,
  } = useForm<PromotionInput>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });

  const promotionType = watch("type");
  const automatic = watch("automatic");
  const audience = watch("audience");

  return (
    <Surface className="grid gap-7" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Sparkles
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Commercial Campaign
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            {promotion
              ? "Edit Promotion"
              : "Create Promotion"}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Configure eligibility, usage limits and financial
            boundaries for a controlled offer.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Promotion Name"
            labelFor="promotion-name"
            required
            error={errors.name?.message}
          >
            <Input
              id="promotion-name"
              disabled={loading}
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Promotion Type"
            labelFor="promotion-type"
            required
            error={errors.type?.message}
          >
            <Select
              id="promotion-type"
              options={typeOptions}
              disabled={loading}
              {...register("type")}
            />
          </FormField>
        </div>

        <FormField
          label="Description"
          labelFor="promotion-description"
          optional
          error={errors.description?.message}
        >
          <Textarea
            id="promotion-description"
            rows={5}
            disabled={loading}
            maxLength={1000}
            {...register("description")}
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <input
              type="checkbox"
              disabled={loading}
              className="mt-1 size-4 accent-[var(--color-gold-500)]"
              {...register("automatic")}
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                Automatic promotion
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                Apply automatically when eligibility conditions are
                satisfied.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <input
              type="checkbox"
              disabled={loading}
              className="mt-1 size-4 accent-[var(--color-gold-500)]"
              {...register("combinable")}
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                Allow combination
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                Permit use with another compatible promotion.
              </span>
            </span>
          </label>
        </div>

        {!automatic ? (
          <FormField
            label="Coupon Code"
            labelFor="promotion-code"
            required
            error={errors.code?.message}
          >
            <Input
              id="promotion-code"
              disabled={loading}
              autoCapitalize="characters"
              placeholder="SYDRA10"
              {...register("code")}
            />
          </FormField>
        ) : null}

        <div className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            {promotionType === "buyXGetY" ? (
              <Gift
                aria-hidden="true"
                className="size-5 text-[var(--color-gold-600)]"
              />
            ) : (
              <BadgePercent
                aria-hidden="true"
                className="size-5 text-[var(--color-gold-600)]"
              />
            )}

            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              Promotion Value
            </h3>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {promotionType === "percentage" ? (
              <>
                <FormField
                  label="Discount Percentage"
                  labelFor="promotion-percentage"
                  required
                  error={
                    errors.percentageBasisPoints?.message
                  }
                >
                  <Controller
                    control={control}
                    name="percentageBasisPoints"
                    render={({ field }) => (
                      <Input
                        id="promotion-percentage"
                        type="number"
                        min={0.01}
                        max={100}
                        step={0.01}
                        value={
                          typeof field.value === "number"
                            ? field.value / 100
                            : ""
                        }
                        disabled={loading}
                        onChange={(event) =>
                          field.onChange(
                            Math.round(
                              Number(event.target.value) * 100
                            )
                          )
                        }
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Maximum Discount (Paise)"
                  labelFor="promotion-maximum-discount"
                  optional
                >
                  <Input
                    id="promotion-maximum-discount"
                    type="number"
                    min={1}
                    disabled={loading}
                    {...register("maximumDiscountPaise", {
                      setValueAs: (value: string) =>
                        value === ""
                          ? undefined
                          : Number(value),
                    })}
                  />
                </FormField>
              </>
            ) : null}

            {promotionType === "fixedAmount" ? (
              <FormField
                label="Discount Amount (Paise)"
                labelFor="promotion-fixed-amount"
                required
                error={errors.fixedAmountPaise?.message}
              >
                <Input
                  id="promotion-fixed-amount"
                  type="number"
                  min={1}
                  disabled={loading}
                  {...register("fixedAmountPaise", {
                    setValueAs: (value: string) =>
                      value === ""
                        ? undefined
                        : Number(value),
                  })}
                />
              </FormField>
            ) : null}

            {promotionType === "buyXGetY" ? (
              <>
                <FormField
                  label="Buy Quantity"
                  labelFor="promotion-buy-quantity"
                  required
                >
                  <Input
                    id="promotion-buy-quantity"
                    type="number"
                    min={1}
                    disabled={loading}
                    {...register("buyQuantity", {
                      setValueAs: (value: string) =>
                        value === ""
                          ? undefined
                          : Number(value),
                    })}
                  />
                </FormField>

                <FormField
                  label="Reward Quantity"
                  labelFor="promotion-reward-quantity"
                  required
                >
                  <Input
                    id="promotion-reward-quantity"
                    type="number"
                    min={1}
                    disabled={loading}
                    {...register("rewardQuantity", {
                      setValueAs: (value: string) =>
                        value === ""
                          ? undefined
                          : Number(value),
                    })}
                  />
                </FormField>
              </>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Audience"
            labelFor="promotion-audience"
            required
            error={errors.audience?.message}
          >
            <Select
              id="promotion-audience"
              options={audienceOptions}
              disabled={loading}
              {...register("audience")}
            />
          </FormField>

          <FormField
            label="Minimum Order (Paise)"
            labelFor="promotion-minimum-order"
            optional
          >
            <Input
              id="promotion-minimum-order"
              type="number"
              min={0}
              disabled={loading}
              {...register("minimumOrderPaise", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </FormField>
        </div>

        {audience === "selectedCustomers" ? (
          <FormField
            label="Customer IDs"
            labelFor="promotion-customer-ids"
            required
            description="Enter one customer ID per line or separate with commas."
          >
            <Controller
              control={control}
              name="customerIds"
              render={({ field }) => (
                <Textarea
                  id="promotion-customer-ids"
                  rows={6}
                  disabled={loading}
                  value={field.value.join("\n")}
                  onChange={(event) =>
                    field.onChange(
                      splitIdentifiers(event.target.value)
                    )
                  }
                />
              )}
            />
          </FormField>
        ) : null}

        <div className="grid gap-5 md:grid-cols-3">
          <FormField
            label="Product IDs"
            labelFor="promotion-product-ids"
            optional
          >
            <Controller
              control={control}
              name="productIds"
              render={({ field }) => (
                <Textarea
                  id="promotion-product-ids"
                  rows={5}
                  disabled={loading}
                  value={field.value.join("\n")}
                  onChange={(event) =>
                    field.onChange(
                      splitIdentifiers(event.target.value)
                    )
                  }
                />
              )}
            />
          </FormField>

          <FormField
            label="Category IDs"
            labelFor="promotion-category-ids"
            optional
          >
            <Controller
              control={control}
              name="categoryIds"
              render={({ field }) => (
                <Textarea
                  id="promotion-category-ids"
                  rows={5}
                  disabled={loading}
                  value={field.value.join("\n")}
                  onChange={(event) =>
                    field.onChange(
                      splitIdentifiers(event.target.value)
                    )
                  }
                />
              )}
            />
          </FormField>

          <FormField
            label="Studio IDs"
            labelFor="promotion-studio-ids"
            optional
          >
            <Controller
              control={control}
              name="studioIds"
              render={({ field }) => (
                <Textarea
                  id="promotion-studio-ids"
                  rows={5}
                  disabled={loading}
                  value={field.value.join("\n")}
                  onChange={(event) =>
                    field.onChange(
                      splitIdentifiers(event.target.value)
                    )
                  }
                />
              )}
            />
          </FormField>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
          <input
            type="checkbox"
            disabled={loading}
            className="mt-1 size-4 accent-[var(--color-gold-500)]"
            {...register("firstOrderOnly")}
          />

          <span>
            <span className="block text-sm font-medium text-foreground">
              First order only
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted">
              Restrict this promotion to customers without a completed
              order.
            </span>
          </span>
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Total Usage Limit"
            labelFor="promotion-total-limit"
            optional
          >
            <Input
              id="promotion-total-limit"
              type="number"
              min={1}
              disabled={loading}
              {...register("totalUsageLimit", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </FormField>

          <FormField
            label="Usage per Customer"
            labelFor="promotion-customer-limit"
            optional
          >
            <Input
              id="promotion-customer-limit"
              type="number"
              min={1}
              disabled={loading}
              {...register("usageLimitPerCustomer", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
            />
          </FormField>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <div className="flex items-center gap-3">
            <CalendarClock
              aria-hidden="true"
              className="size-5 text-[var(--color-gold-600)]"
            />

            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              Campaign Schedule
            </h3>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField
              label="Starts At"
              labelFor="promotion-start"
              required
            >
              <Controller
                control={control}
                name="startsAt"
                render={({ field }) => (
                  <Input
                    id="promotion-start"
                    type="datetime-local"
                    value={toLocalDateTime(field.value)}
                    disabled={loading}
                    onChange={(event) =>
                      field.onChange(
                        new Date(
                          event.target.value
                        ).toISOString()
                      )
                    }
                  />
                )}
              />
            </FormField>

            <FormField
              label="Ends At"
              labelFor="promotion-end"
              optional
              error={errors.endsAt?.message}
            >
              <Controller
                control={control}
                name="endsAt"
                render={({ field }) => (
                  <Input
                    id="promotion-end"
                    type="datetime-local"
                    value={toLocalDateTime(field.value)}
                    disabled={loading}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          ? new Date(
                              event.target.value
                            ).toISOString()
                          : undefined
                      )
                    }
                  />
                )}
              />
            </FormField>
          </div>
        </div>

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
            disabled={promotion ? !isDirty : false}
            loading={loading}
            loadingLabel="Saving Promotion"
          >
            <Save
              aria-hidden="true"
              className="size-4"
            />
            Save Promotion
          </Button>
        </div>
      </form>
    </Surface>
  );
}
