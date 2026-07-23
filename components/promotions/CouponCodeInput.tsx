"use client";

import { useState } from "react";
import {
  BadgeCheck,
  BadgePercent,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface CouponCodeInputProps {
  readonly appliedCode?: string | null;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly successMessage?: string | null;
  readonly className?: string;
  readonly onApply: (
    code: string
  ) => void | Promise<void>;
  readonly onRemove?: () => void | Promise<void>;
}

export function CouponCodeInput({
  appliedCode,
  className,
  error,
  loading = false,
  onApply,
  onRemove,
  successMessage,
}: CouponCodeInputProps): React.JSX.Element {
  const [code, setCode] = useState(appliedCode ?? "");

  if (appliedCode) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-[var(--radius-lg)] border",
          "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)] p-5",
          "sm:flex-row sm:items-center sm:justify-between",
          className
        )}
      >
        <div className="flex items-start gap-3">
          <BadgeCheck
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]"
          />

          <div>
            <p className="font-mono text-sm font-semibold text-foreground">
              {appliedCode}
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              {successMessage ??
                "Promotion applied successfully."}
            </p>
          </div>
        </div>

        {onRemove ? (
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
        ) : null}
      </div>
    );
  }

  const valid = /^[A-Z0-9_-]{3,30}$/.test(
    code.trim().toUpperCase()
  );

  return (
    <div className={cn("grid gap-3", className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <BadgePercent
          aria-hidden="true"
          className="size-4 text-[var(--color-gold-600)]"
        />
        Promotion Code
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={code}
          disabled={loading}
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="Enter coupon code"
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
            void onApply(code.trim().toUpperCase());
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
