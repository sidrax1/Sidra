"use client";

import { useState } from "react";
import { PackageX, ShieldAlert } from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { InventoryDamageInput } from "@/lib/schemas/inventory";

interface InventoryDamageFormProps {
  readonly inventoryId: string;
  readonly availableQuantity: number;
  readonly evidencePaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: InventoryDamageInput
  ) => void | Promise<void>;
}

export function InventoryDamageForm({
  availableQuantity,
  evidencePaths = [],
  inventoryId,
  loading = false,
  onFilesSelected,
  onSubmit,
}: InventoryDamageFormProps): React.JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const valid =
    quantity > 0 &&
    quantity <= availableQuantity &&
    reason.trim().length >= 5;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.08)] text-[var(--color-error)]">
          <PackageX className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-error)]">
            Inventory Loss
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Record Damaged Stock
          </h2>
        </div>
      </header>

      <Alert
        variant="warning"
        title="This reduces sellable inventory"
        description="The action is permanent and recorded in the inventory audit trail."
        icon={<ShieldAlert className="size-5" />}
      />

      <FormField
        label="Damaged Quantity"
        labelFor="damaged-quantity"
        required
      >
        <Input
          id="damaged-quantity"
          type="number"
          min={1}
          max={availableQuantity}
          value={quantity}
          disabled={loading}
          onChange={(event) =>
            setQuantity(Number(event.target.value))
          }
        />
      </FormField>

      <FormField
        label="Damage Reason"
        labelFor="damage-reason"
        required
      >
        <Textarea
          id="damage-reason"
          value={reason}
          rows={6}
          disabled={loading}
          maxLength={1000}
          onChange={(event) =>
            setReason(event.target.value)
          }
        />
      </FormField>

      <FileDropzone
        accept={[
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/pdf",
        ]}
        maximumSizeBytes={20 * 1024 * 1024}
        multiple
        disabled={loading || !onFilesSelected}
        label="Damage Evidence"
        description="Upload photographs or inspection documentation."
        onFilesSelected={(files) =>
          onFilesSelected?.(files)
        }
      />

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          variant="danger"
          disabled={!valid}
          loading={loading}
          loadingLabel="Recording Damage"
          onClick={() =>
            void onSubmit({
              inventoryId,
              quantity,
              reason: reason.trim(),
              evidencePaths: [...evidencePaths],
            })
          }
        >
          Record Damaged Stock
        </Button>
      </div>
    </Surface>
  );
}
