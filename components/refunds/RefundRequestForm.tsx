"use client";

import {
  BadgeIndianRupee,
  ReceiptText,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {
  useMemo,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import {
  refundRequestSchema,
  type RefundRequestInput,
} from "@/lib/schemas/refund";

interface RefundRequestFormProps {
  readonly orderId: string;
  readonly maximumRefundPaise: number;
  readonly defaultAmountPaise?: number;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: RefundRequestInput
  ) => void | Promise<void>;
}

export function RefundRequestForm({
  defaultAmountPaise,
  loading = false,
  maximumRefundPaise,
  onSubmit,
  orderId,
}: RefundRequestFormProps): React.JSX.Element {
  const initialAmount = useMemo(
    () =>
      Math.min(
        Math.max(
          defaultAmountPaise ??
            maximumRefundPaise,
          1
        ),
        maximumRefundPaise
      ),
    [
      defaultAmountPaise,
      maximumRefundPaise,
    ]
  );

  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } = useForm<RefundRequestInput>({
    resolver: zodResolver(
      refundRequestSchema
    ),
    mode: "onChange",
    defaultValues: {
      orderId,
      amountPaise: initialAmount,
      reason: "",
    },
  });

  const amountPaise =
    watch("amountPaise");

  const reason =
    watch("reason");

  return (
    <Surface
      className="grid gap-7"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <RefreshCcw
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Financial Resolution
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Request Refund
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Submit a refund request against the selected order.
            Eligibility, captured payment value and previous refunds
            are verified server-side.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Refund requests require financial verification"
        description="The requested amount cannot exceed the remaining refundable value of the order."
        icon={
          <ShieldCheck
            aria-hidden="true"
            className="size-5"
          />
        }
      />

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(
          onSubmit
        )}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <ReceiptText
                aria-hidden="true"
                className="size-3.5"
              />
              Order ID
            </p>

            <p className="mt-3 break-all font-mono text-sm text-foreground">
              {orderId}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Maximum Refundable
            </p>

            <Price
              amount={
                maximumRefundPaise /
                100
              }
              size="xl"
              className="mt-2"
            />
          </div>
        </div>

        <FormField
          label="Refund Amount (Paise)"
          labelFor="refund-request-amount"
          required
          error={
            errors.amountPaise
              ?.message
          }
          description={`Requested value: ₹${(
            Number(
              amountPaise
            ) / 100
          ).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
        >
          <div className="relative">
            <BadgeIndianRupee
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            />

            <Input
              id="refund-request-amount"
              type="number"
              min={1}
              max={
                maximumRefundPaise
              }
              step={1}
              disabled={loading}
              className="pl-11"
              {...register(
                "amountPaise",
                {
                  valueAsNumber: true,
                }
              )}
            />
          </div>
        </FormField>

        <FormField
          label="Refund Reason"
          labelFor="refund-request-reason"
          required
          error={
            errors.reason?.message
          }
          description={`${reason.length}/1000 characters`}
        >
          <Textarea
            id="refund-request-reason"
            rows={8}
            minLength={10}
            maxLength={1000}
            disabled={loading}
            placeholder="Explain why the refund is required and include any relevant payment, delivery or product information."
            {...register("reason")}
          />
        </FormField>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={
              !isValid ||
              maximumRefundPaise <= 0
            }
            loading={loading}
            loadingLabel="Submitting Refund"
          >
            <RefreshCcw
              aria-hidden="true"
              className="size-4"
            />
            Submit Refund Request
          </Button>
        </div>
      </form>
    </Surface>
  );
}
