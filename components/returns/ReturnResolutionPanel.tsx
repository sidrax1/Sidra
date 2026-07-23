"use client";

import { useState } from "react";
import { BadgeIndianRupee, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { ReturnResolutionInput } from "@/lib/schemas/return";

interface ReturnResolutionPanelProps {
  readonly returnRequestId: string;
  readonly maximumRefundPaise: number;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: ReturnResolutionInput
  ) => void | Promise<void>;
}

const resolutionOptions = [
  { value: "replacement", label: "Replacement" },
  { value: "refund", label: "Refund" },
  { value: "storeCredit", label: "Store Credit" },
] as const;

export function ReturnResolutionPanel({
  loading = false,
  maximumRefundPaise,
  onSubmit,
  returnRequestId,
}: ReturnResolutionPanelProps): React.JSX.Element {
  const [resolution, setResolution] =
    useState<ReturnResolutionInput["resolution"]>(
      "refund"
    );

  const [resolutionNote, setResolutionNote] = useState("");
  const [approvedRefundPaise, setApprovedRefundPaise] =
    useState(maximumRefundPaise);

  const valid =
    resolutionNote.trim().length >= 10 &&
    approvedRefundPaise >= 0 &&
    approvedRefundPaise <= maximumRefundPaise;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]">
          <CheckCircle2 className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-success)]">
            Final Resolution
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Resolve Return Request
          </h2>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Resolution"
          labelFor="return-final-resolution"
          required
        >
          <Select
            id="return-final-resolution"
            value={resolution}
            options={resolutionOptions}
            disabled={loading}
            onChange={(event) =>
              setResolution(
                event.target
                  .value as ReturnResolutionInput["resolution"]
              )
            }
          />
        </FormField>

        <FormField
          label="Approved Amount (Paise)"
          labelFor="return-approved-amount"
          required
        >
          <div className="relative">
            <BadgeIndianRupee className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />

            <Input
              id="return-approved-amount"
              type="number"
              min={0}
              max={maximumRefundPaise}
              value={approvedRefundPaise}
              disabled={loading}
              className="pl-11"
              onChange={(event) =>
                setApprovedRefundPaise(
                  Number(event.target.value)
                )
              }
            />
          </div>
        </FormField>
      </div>

      <FormField
        label="Resolution Note"
        labelFor="return-resolution-note"
        required
      >
        <Textarea
          id="return-resolution-note"
          value={resolutionNote}
          rows={7}
          disabled={loading}
          maxLength={2000}
          onChange={(event) =>
            setResolutionNote(event.target.value)
          }
        />
      </FormField>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Resolving Return"
          onClick={() =>
            void onSubmit({
              returnRequestId,
              resolution,
              resolutionNote: resolutionNote.trim(),
              approvedRefundPaise,
            })
          }
        >
          Finalize Resolution
        </Button>
      </div>
    </Surface>
  );
}
