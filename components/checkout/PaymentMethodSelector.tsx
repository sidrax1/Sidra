"use client";

import {
  Banknote,
  Building2,
  CreditCard,
  Smartphone,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

export type CheckoutPaymentMethod =
 | "upi"
 | "card"
 | "netBanking"
 | "cashOnDelivery";

export interface PaymentMethodOption {
  readonly value: CheckoutPaymentMethod;
  readonly title: string;
  readonly description: string;
  readonly disabled?: boolean;
}

interface PaymentMethodSelectorProps {
  readonly value: CheckoutPaymentMethod;
  readonly options?: readonly PaymentMethodOption[];
  readonly disabled?: boolean;
  readonly onChange: (
    value: CheckoutPaymentMethod
  ) => void;
}

const iconMap = {
  upi: Smartphone,
  card: CreditCard,
  netBanking: Building2,
  cashOnDelivery: Banknote,
} as const;

const defaultOptions: readonly PaymentMethodOption[] =
 [
   {
     value: "upi",
     title: "UPI",
     description:
       "Pay securely using any supported UPI application.",
   },
   {
     value: "card",
     title: "Credit or Debit Card",
     description:
       "Use Visa, Mastercard, RuPay or supported cards.",
   },
   {
     value: "netBanking",
     title: "Net Banking",
     description:
       "Pay directly through your supported bank.",
   },
   {
     value: "cashOnDelivery",
     title: "Cash on Delivery",
     description:
       "Pay when your order arrives, where available.",
   },
 ];

export function PaymentMethodSelector({
  disabled = false,
  onChange,
  options = defaultOptions,
  value,
}: PaymentMethodSelectorProps): React.JSX.Element {
  return (
   <div
     role="radiogroup"
     aria-label="Payment method"
     className="grid gap-3"
   >
     {options.map(
      (option) => {
        const selected =
         value ===
         option.value;

      const Icon =
       iconMap[
         option.value
       ];

     return (
      <label
        key={
          option.value
        }
        className={cn(
          "flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border p-5",
          "transition-[border-color,background-color,box-shadow]",
          "duration-[var(--duration-base)]",
          selected
            ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.07)]shadow-[var(--shadow-gold-glow)]"
            : "border-border bg-card hover:border-[color:rgb(200_169_106_/_0.35)]",
          (disabled ||
            option.disabled) &&
            "cursor-not-allowed opacity-45"
        )}
      >
        <input
          type="radio"
          name="payment-method"

          value={
            option.value
          }
          checked={selected}
          disabled={
            disabled ||
            option.disabled
          }
          onChange={() =>
            onChange(
              option.value
            )
          }
          className="sr-only"
         />

          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-full border",
              selected
                ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)]text-[var(--color-gold-600)]"
                : "border-border bg-background text-muted"
            )}
          >
            <Icon
              aria-hidden={true}
              className="size-5"
            />
          </span>

         <span className="min-w-0">
          <span className="block font-medium text-foreground">
           {option.title}
          </span>

           <span className="mt-1 block text-sm leading-6 text-muted">
            {
              option.description
            }
           </span>
         </span>
        </label>
      );

      }
    )}
   </div>
 );
}
