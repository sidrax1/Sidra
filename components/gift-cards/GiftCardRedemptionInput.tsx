"use client";

import { useState } from "react";
import {
  Gift,
  ShieldCheck,
  X,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";

interface GiftCardRedemptionInputProps {
  readonly appliedCode?: string | null;
  readonly appliedAmountPaise?: number;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onApply: (
    code: string
  ) => void | Promise<void>;
  readonly onRemove?: () => void | Promise<void>;
}

export function GiftCardRedemptionInput({
  appliedAmountPaise = 0,
  appliedCode,
  error,
  loading = false,
  onApply,
  onRemove,
}: GiftCardRedemptionInputProps): React.JSX.Element {
  const [code, setCode] = useState("");

  if (appliedCode) {
    return (
      <Alert
        variant="success"
        title={`Gift card ${appliedCode} applied`}
        description={
          <span className="inline-flex items-center gap-2">
            Applied value:
            <Price
              amount={appliedAmountPaise / 100}
              size="sm"
            />
          </span>
        }
        icon={
          <ShieldCheck
            aria-hidden="true"
            className="size-5"
          />
        }
        action={
          onRemove ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => {
                void onRemove();
                setCode("");
              }}
            >
              <X
                aria-hidden="true"
                className="size-4"
              />
              Remove
            </Button>
          ) : undefined
        }
      />
    );
  }

  const normalizedCode = code
    .trim()
    .toUpperCase();

  const valid =
    /^[A-Z0-9-]{8,40}$/.test(normalizedCode);

  return (
    <div className="grid gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <Gift
          aria-hidden="true"
          className="size-4 text-[var(--color-gold-600)]"
        />
        Apply Gift Card
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={code}
          disabled={loading}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="Enter gift card code"
          className="font-mono uppercase"
          invalid={Boolean(error)}
          onChange={(event) =>
            setCode(event.target.value.toUpperCase())
          }
        />

        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Applying"
          className="sm:min-w-28"
          onClick={() => {
            void onApply(normalizedCode);
          }}
        >
          Apply
        </Button>
      </div>

      {error ? (
        <p
          role="alert"
          className="text-xs text-[var(--color-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
