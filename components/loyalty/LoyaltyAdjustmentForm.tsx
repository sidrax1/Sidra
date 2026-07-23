"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  CalendarClock,
  Coins,
  Save,
  ShieldAlert,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type {
  LoyaltyAdjustmentInput,
} from "@/lib/schemas/loyalty";

interface LoyaltyAdjustmentFormProps {
  readonly customerId: string;
  readonly currentBalance: number;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: LoyaltyAdjustmentInput
  ) => void | Promise<void>;
}

export function LoyaltyAdjustmentForm({
  currentBalance,
  customerId,
  loading = false,
  onSubmit,
}: LoyaltyAdjustmentFormProps): React.JSX.Element {
  const [points, setPoints] =
    useState(0);

  const [reason, setReason] =
    useState("");

  const [reference, setReference] =
    useState("");

  const [expiresAt, setExpiresAt] =
    useState("");

  const resultingBalance =
    currentBalance + points;

  const valid =
    points !== 0 &&
    Math.abs(points) <=
      1_000_000 &&
    resultingBalance >= 0 &&
    reason.trim().length >= 10;

  const maximumExpirationDate =
    useMemo(() => {
      const date = new Date();
      date.setFullYear(
        date.getFullYear() + 5
      );

      return date
        .toISOString()
        .slice(0, 16);
    }, []);

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Coins
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Controlled Ledger Action
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Adjust Loyalty Points
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Every manual credit or debit is written to the immutable
            loyalty transaction history.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Manual adjustments require an auditable reason"
        description="Use positive values for credits and negative values for deductions. The resulting balance cannot be below zero."
        icon={
          <ShieldAlert
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Point Adjustment"
          labelFor="loyalty-adjustment-points"
          required
        >
          <Input
            id="loyalty-adjustment-points"
            type="number"
            step={1}
            min={-1_000_000}
            max={1_000_000}
            value={points}
            disabled={loading}
            onChange={(event) =>
              setPoints(
                Number(
                  event.target.value
                )
              )
            }
          />
        </FormField>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Resulting Balance
          </p>

          <p
            className={[
              "mt-2 font-heading text-4xl font-medium tracking-[-0.04em]",
              resultingBalance >= 0
                ? "text-foreground"
                : "text-[var(--color-error)]",
            ].join(" ")}
          >
            {resultingBalance.toLocaleString(
              "en-IN"
            )}
          </p>
        </div>
      </div>

      <FormField
        label="Adjustment Reason"
        labelFor="loyalty-adjustment-reason"
        required
        description={`${reason.length}/1500 characters`}
      >
        <Textarea
          id="loyalty-adjustment-reason"
          value={reason}
          rows={7}
          minLength={10}
          maxLength={1500}
          disabled={loading}
          onChange={(event) =>
            setReason(
              event.target.value
            )
          }
        />
      </FormField>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Reference"
          labelFor="loyalty-adjustment-reference"
          optional
        >
          <Input
            id="loyalty-adjustment-reference"
            value={reference}
            maxLength={150}
            disabled={loading}
            onChange={(event) =>
              setReference(
                event.target.value
              )
            }
          />
        </FormField>

        <FormField
          label="Expiration Date"
          labelFor="loyalty-adjustment-expiration"
          optional
        >
          <div className="relative">
            <CalendarClock
              aria-hidden={true}
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            />

            <Input
              id="loyalty-adjustment-expiration"
              type="datetime-local"
              value={expiresAt}
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              max={
                maximumExpirationDate
              }
              disabled={
                loading ||
                points < 0
              }
              className="pl-11"
              onChange={(event) =>
                setExpiresAt(
                  event.target.value
                )
              }
            />
          </div>
        </FormField>
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Saving Adjustment"
          onClick={() => {
            void onSubmit({
              customerId,
              points,
              reason:
                reason.trim(),
              reference:
                reference.trim() ||
                undefined,
              expiresAt:
                points > 0 &&
                expiresAt
                  ? new Date(
                      expiresAt
                    ).toISOString()
                  : undefined,
            });
          }}
        >
          <Save
            aria-hidden={true}
            className="size-4"
          />
          Save Point Adjustment
        </Button>
      </div>
    </Surface>
  );
}
