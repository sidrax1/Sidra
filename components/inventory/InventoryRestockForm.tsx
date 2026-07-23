"use client";

import { useForm } from "react-hook-form";
import { PackagePlus } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { InventoryRestockInput } from "@/lib/schemas/inventory";

interface InventoryRestockFormProps {
  readonly inventoryId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: InventoryRestockInput
  ) => void | Promise<void>;
}

interface RestockFormValues {
  readonly quantity: number;
  readonly supplierReference: string;
  readonly receivedAt: string;
  readonly note: string;
}

export function InventoryRestockForm({
  inventoryId,
  loading = false,
  onSubmit,
}: InventoryRestockFormProps): React.JSX.Element {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RestockFormValues>({
    defaultValues: {
      quantity: 1,
      supplierReference: "",
      receivedAt: new Date()
        .toISOString()
        .slice(0, 16),
      note: "",
    },
  });

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]">
          <PackagePlus className="size-5" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-success)]">
            Stock Receipt
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em]">
            Record Restock
          </h2>
        </div>
      </header>

      <form
        className="grid gap-5"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit({
            inventoryId,
            quantity: values.quantity,
            supplierReference:
              values.supplierReference.trim() || undefined,
            receivedAt: new Date(
              values.receivedAt
            ).toISOString(),
            note: values.note.trim() || undefined,
          });
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Quantity Received"
            labelFor="restock-quantity"
            required
            error={errors.quantity?.message}
          >
            <Input
              id="restock-quantity"
              type="number"
              min={1}
              step={1}
              disabled={loading}
              {...register("quantity", {
                valueAsNumber: true,
                min: 1,
              })}
            />
          </FormField>

          <FormField
            label="Received At"
            labelFor="restock-received-at"
            required
          >
            <Input
              id="restock-received-at"
              type="datetime-local"
              disabled={loading}
              {...register("receivedAt", {
                required: true,
              })}
            />
          </FormField>
        </div>

        <FormField
          label="Supplier Reference"
          labelFor="restock-supplier-reference"
          optional
        >
          <Input
            id="restock-supplier-reference"
            disabled={loading}
            {...register("supplierReference")}
          />
        </FormField>

        <FormField
          label="Restock Note"
          labelFor="restock-note"
          optional
        >
          <Textarea
            id="restock-note"
            rows={6}
            disabled={loading}
            maxLength={1000}
            {...register("note")}
          />
        </FormField>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            loading={loading}
            loadingLabel="Recording Restock"
          >
            Record Restock
          </Button>
        </div>
      </form>
    </Surface>
  );
}
