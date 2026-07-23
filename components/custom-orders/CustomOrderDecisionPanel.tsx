"use client";

import { useState } from "react";
import {
  CheckCircle2,
  MessageSquareText,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { CustomOrder } from "@/types/custom-order";
import type { CustomOrderDecision } from "@/types/custom-order-workflow";

interface CustomOrderDecisionPanelProps {
  readonly customOrder: CustomOrder;
  readonly loading?: boolean;
  readonly onSubmit: (input: {
    readonly customOrderId: string;
    readonly decision: CustomOrderDecision;
    readonly message: string;
  }) => void | Promise<void>;
}

const decisionOptions: readonly {
  readonly value: CustomOrderDecision;
  readonly title: string;
  readonly description: string;
}[] = [
  {
    value: "accept",
    title: "Accept Request",
    description:
      "Confirm studio capability and continue to commercial quotation.",
  },
  {
    value: "requestClarification",
    title: "Request Clarification",
    description:
      "Ask the collector for missing measurements, references or design details.",
  },
  {
    value: "reject",
    title: "Decline Request",
    description:
      "Record why the studio cannot fulfil this private commission.",
  },
];

export function CustomOrderDecisionPanel({
  customOrder,
  loading = false,
  onSubmit,
}: CustomOrderDecisionPanelProps): React.JSX.Element {
  const [decision, setDecision] =
    useState<CustomOrderDecision | null>(null);

  const [message, setMessage] =
    useState("");

  const messageRequired =
    decision === "requestClarification" ||
    decision === "reject";

  const valid =
    decision !== null &&
    (!messageRequired ||
      message.trim().length >= 10);

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Studio Review
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Evaluate Commission
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Review the submitted specification before the studio
          prepares a formal quotation.
        </p>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {decisionOptions.map((option) => {
          const selected =
            decision === option.value;

          const destructive =
            option.value === "reject";

          return (
            <button
              key={option.value}
              type="button"
              disabled={loading}
              aria-pressed={selected}
              onClick={() =>
                setDecision(option.value)
              }
              className={[
                "rounded-[var(--radius-lg)] border p-5 text-left",
                "transition-[border-color,background-color,box-shadow,transform]",
                "duration-[var(--duration-base)] hover:-translate-y-0.5",
                selected
                  ? destructive
                    ? "border-[var(--color-error)] bg-[color:rgb(140_59_52_/_0.08)] shadow-[var(--shadow-card)]"
                    : "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)] shadow-[var(--shadow-gold-glow)]"
                  : "border-border bg-card hover:border-[color:rgb(200_169_106_/_0.38)]",
              ].join(" ")}
            >
              {option.value === "accept" ? (
                <CheckCircle2
                  aria-hidden={true}
                  className="size-6 text-[var(--color-success)]"
                />
              ) : option.value ===
                "requestClarification" ? (
                <MessageSquareText
                  aria-hidden={true}
                  className="size-6 text-[var(--color-gold-600)]"
                />
              ) : (
                <XCircle
                  aria-hidden={true}
                  className="size-6 text-[var(--color-error)]"
                />
              )}

              <p className="mt-4 font-medium text-foreground">
                {option.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-muted">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {decision ? (
        <FormField
          label={
            decision === "accept"
              ? "Message to Collector"
              : "Required Explanation"
          }
          labelFor="custom-order-decision-message"
          required={messageRequired}
          optional={!messageRequired}
          description={
            messageRequired
              ? "Provide at least 10 characters."
              : "Add an optional acknowledgement."
          }
        >
          <Textarea
            id="custom-order-decision-message"
            value={message}
            rows={6}
            disabled={loading}
            maxLength={1500}
            onChange={(event) =>
              setMessage(event.target.value)
            }
          />
        </FormField>
      ) : null}

      {decision === "reject" ? (
        <Alert
          variant="warning"
          title="This decision will be recorded"
          description="The rejection reason will be added to the permanent audit trail and shared with the collector."
          icon={
            <ShieldAlert
              aria-hidden={true}
              className="size-5"
            />
          }
        />
      ) : null}

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Submitting Decision"
          variant={
            decision === "reject"
              ? "danger"
              : "primary"
          }
          onClick={() => {
            if (!decision) {
              return;
            }

            void onSubmit({
              customOrderId:
                customOrder.id,
              decision,
              message: message.trim(),
            });
          }}
        >
          Submit Decision
        </Button>
      </div>
    </Surface>
  );
}
