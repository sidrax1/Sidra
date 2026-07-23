"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Gift,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Price } from "@/components/ui/Price";
import { Surface } from "@/components/ui/Surface";
import { formatDate } from "@/lib/date";
import type { GiftCardValidationResult } from "@/services/giftCardService";

interface GiftCardBalanceCheckerProps {
  readonly loading?: boolean;
  readonly result?: GiftCardValidationResult | null;
  readonly error?: string | null;
  readonly onCheck: (
    code: string
  ) => void | Promise<void>;
}

export function GiftCardBalanceChecker({
  error,
  loading = false,
  onCheck,
  result,
}: GiftCardBalanceCheckerProps): React.JSX.Element {
  const [code, setCode] = useState("");

  const normalizedCode = code
    .trim()
    .toUpperCase();

  const valid =
    /^[A-Z0-9-]{8,40}$/.test(normalizedCode);

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Gift
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Protected Balance
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Check Gift Card Balance
          </h2>
        </div>
      </header>

      <FormField
        label="Gift Card Code"
        labelFor="gift-card-balance-code"
        required
        error={error ?? undefined}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="gift-card-balance-code"
            value={code}
            disabled={loading}
            autoCapitalize="characters"
            autoComplete="off"
            className="font-mono uppercase"
            invalid={Boolean(error)}
            onChange={(event) =>
              setCode(event.target.value.toUpperCase())
            }
          />

          <Button
            disabled={!valid}
            loading={loading}
            loadingLabel="Checking"
            className="sm:min-w-32"
            onClick={() => {
              void onCheck(normalizedCode);
            }}
          >
            <Search
              aria-hidden={true}
              className="size-4"
            />
            Check
          </Button>
        </div>
      </FormField>

      {result ? (
        result.valid ? (
          <div className="rounded-[var(--radius-lg)] border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)] p-6">
            <div className="flex items-center gap-3">
              <BadgeCheck
                aria-hidden={true}
                className="size-5 text-[var(--color-success)]"
              />

              <p className="font-medium text-foreground">
                Valid Sydra Gift Card
              </p>
            </div>

            <p className="mt-5 text-xs uppercase tracking-[0.14em] text-muted">
              Available Balance
            </p>

            <Price
              amount={result.balancePaise / 100}
              size="xl"
              className="mt-2"
            />

            {result.expiresAt ? (
              <p className="mt-3 text-xs text-muted">
                Valid until{" "}
                {formatDate(result.expiresAt)}
              </p>
            ) : null}
          </div>
        ) : (
          <Alert
            variant="warning"
            title="Gift card unavailable"
            description={result.message}
            icon={
              <ShieldCheck
                aria-hidden={true}
                className="size-5"
              />
            }
          />
        )
      ) : null}
    </Surface>
  );
}
