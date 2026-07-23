"use client";

import { useState } from "react";
import { Camera, Send, ShieldAlert } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { ReturnEvidenceRequestInput } from "@/lib/schemas/return";

interface ReturnEvidenceRequestPanelProps {
  readonly returnRequestId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: ReturnEvidenceRequestInput
  ) => void | Promise<void>;
}

export function ReturnEvidenceRequestPanel({
  loading = false,
  onSubmit,
  returnRequestId,
}: ReturnEvidenceRequestPanelProps): React.JSX.Element {
  const [message, setMessage] = useState("");
  const [evidence, setEvidence] = useState<string[]>([""]);

  const cleanedEvidence = evidence
    .map((item) => item.trim())
    .filter(Boolean);

  const valid =
    message.trim().length >= 10 &&
    cleanedEvidence.length > 0;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Camera className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Verification Requirement
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Request Additional Evidence
          </h2>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Be precise and proportionate"
        description="Request only evidence necessary to evaluate the reported issue."
        icon={<ShieldAlert className="size-5" />}
      />

      <FormField
        label="Customer Message"
        labelFor="evidence-request-message"
        required
      >
        <Textarea
          id="evidence-request-message"
          value={message}
          rows={6}
          disabled={loading}
          maxLength={1500}
          onChange={(event) =>
            setMessage(event.target.value)
          }
        />
      </FormField>

      <div className="grid gap-3">
        {evidence.map((item, index) => (
          <FormField
            key={index}
            label={`Evidence Requirement ${index + 1}`}
            labelFor={`evidence-requirement-${index}`}
            required
          >
            <Input
              id={`evidence-requirement-${index}`}
              value={item}
              disabled={loading}
              maxLength={200}
              onChange={(event) =>
                setEvidence((current) =>
                  current.map((value, itemIndex) =>
                    itemIndex === index
                      ? event.target.value
                      : value
                  )
                )
              }
            />
          </FormField>
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-5">
        <Button
          variant="outline"
          disabled={loading || evidence.length >= 10}
          onClick={() =>
            setEvidence((current) => [...current, ""])
          }
        >
          Add Requirement
        </Button>

        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Sending Request"
          onClick={() =>
            void onSubmit({
              returnRequestId,
              message: message.trim(),
              requiredEvidence: cleanedEvidence,
            })
          }
        >
          <Send className="size-4" />
          Request Evidence
        </Button>
      </div>
    </Surface>
  );
}
