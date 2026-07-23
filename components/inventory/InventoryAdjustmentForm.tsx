"use client";

import { useState } from "react";
import { Boxes, Save } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { InventoryAdjustmentInput } from "@/lib/schemas/inventory";

interface InventoryAdjustmentFormProps {
  readonly inventoryId: string;
  readonly currentQuantity: number;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: InventoryAdjustmentInput
  ) => void | Promise<void>;
}

export function InventoryAdjustmentForm({
  currentQuantity,
  inventoryId,
  loading = false,
  onSubmit,
}: InventoryAdjustmentFormProps): React.JSX.Element {
  const [quantityChange, setQuantityChange] = useState(0);
  const [reason, setReason] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const resultingQuantity =
    currentQuantity + quantityChange;

  const valid =
    quantityChange !== 0 &&
    resultingQuantity >= 0 &&
    reason.trim().length >= 5;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Boxes className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Controlled Adjustment
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Adjust Inventory
          </h2>
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Quantity Change"
          labelFor="inventory-quantity-change"
          required
        >
          <Input
            id="inventory-quantity-change"
            type="number"
            step={1}
            value={quantityChange}
            disabled={loading}
            onChange={(event) =>
              setQuantityChange(
                Number(event.target.value)
              )
            }
          />
        </FormField>

        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Resulting Quantity
          </p>

          <p className="mt-2 font-heading text-3xl font-medium">
            {resultingQuantity}
          </p>
        </div>
      </div>

      <FormField
        label="Reference ID"
        labelFor="inventory-reference-id"
        optional
      >
        <Input
          id="inventory-reference-id"
          value={referenceId}
          disabled={loading}
          onChange={(event) =>
            setReferenceId(event.target.value)
          }
        />
      </FormField>

      <FormField
        label="Adjustment Reason"
        labelFor="inventory-adjustment-reason"
        required
      >
        <Textarea
          id="inventory-adjustment-reason"
          value={reason}
          rows={6}
          disabled={loading}
          maxLength={1000}
          onChange={(event) =>
            setReason(event.target.value)
          }
        />
      </FormField>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Saving Adjustment"
          onClick={() =>
            void onSubmit({
              inventoryId,
              quantityChange,
              reason: reason.trim(),
              referenceId:
                referenceId.trim() || undefined,
            })
          }
        >
          <Save className="size-4" />
          Save Adjustment
        </Button>
      </div>
    </Surface>
  );
}
