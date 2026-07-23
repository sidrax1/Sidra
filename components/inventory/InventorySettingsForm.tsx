"use client";

import { useState } from "react";
import { Settings2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import type { InventorySettingsInput } from "@/lib/schemas/inventory";
import type { InventoryRecord } from "@/types/inventory";

interface InventorySettingsFormProps {
  readonly inventory: InventoryRecord;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: InventorySettingsInput
  ) => void | Promise<void>;
}

export function InventorySettingsForm({
  inventory,
  loading = false,
  onSubmit,
}: InventorySettingsFormProps): React.JSX.Element {
  const [reorderThreshold, setReorderThreshold] = useState(
    inventory.reorderThreshold
  );

  const [allowBackorder, setAllowBackorder] = useState(
    inventory.allowBackorder
  );

  const [trackInventory, setTrackInventory] = useState(
    inventory.trackInventory
  );

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Settings2 className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Stock Controls
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Inventory Settings
          </h2>
        </div>
      </header>

      <FormField
        label="Reorder Threshold"
        labelFor="inventory-reorder-threshold"
        required
      >
        <Input
          id="inventory-reorder-threshold"
          type="number"
          min={0}
          step={1}
          value={reorderThreshold}
          disabled={loading}
          onChange={(event) =>
            setReorderThreshold(
              Number(event.target.value)
            )
          }
        />
      </FormField>

      <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
        <input
          type="checkbox"
          checked={trackInventory}
          disabled={loading}
          onChange={(event) =>
            setTrackInventory(event.target.checked)
          }
          className="mt-1 size-4 accent-[var(--color-gold-500)]"
        />

        <span>
          <span className="block text-sm font-medium">
            Track inventory
          </span>
          <span className="mt-1 block text-xs text-muted">
            Prevent uncontrolled stock quantities.
          </span>
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
        <input
          type="checkbox"
          checked={allowBackorder}
          disabled={loading || !trackInventory}
          onChange={(event) =>
            setAllowBackorder(event.target.checked)
          }
          className="mt-1 size-4 accent-[var(--color-gold-500)]"
        />

        <span>
          <span className="block text-sm font-medium">
            Allow backorders
          </span>
          <span className="mt-1 block text-xs text-muted">
            Permit checkout when available inventory is exhausted.
          </span>
        </span>
      </label>

      <div className="flex items-start gap-3 text-xs leading-6 text-muted">
        <ShieldCheck className="mt-0.5 size-4 text-[var(--color-success)]" />
        Reservations and fulfilment deductions remain server-side.
      </div>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          loading={loading}
          loadingLabel="Saving Settings"
          onClick={() =>
            void onSubmit({
              inventoryId: inventory.id,
              reorderThreshold,
              allowBackorder,
              trackInventory,
            })
          }
        >
          Save Settings
        </Button>
      </div>
    </Surface>
  );
}
