"use client";

import {
  useState,
} from "react";
import {
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  OrderDeliveryConfirmationInput,
} from "@/lib/schemas/order";

interface OrderDeliveryConfirmationPanelProps {
  readonly orderId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: OrderDeliveryConfirmationInput
  ) => void | Promise<void>;
}

export function OrderDeliveryConfirmationPanel({
  loading = false,
  onSubmit,
  orderId,
}: OrderDeliveryConfirmationPanelProps): React.JSX.Element {
  const [
    received,
    setReceived,
  ] = useState(false);

  const [
    conditionConfirmed,
    setConditionConfirmed,
  ] = useState(false);

  const [
    deliveryNote,
    setDeliveryNote,
  ] = useState("");

  const valid =
    received &&
    conditionConfirmed;

  return (
    <Surface
      className="grid gap-6 border-[color:rgb(62_107_82_/_0.28)]"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]">
          <PackageCheck
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-success)]">
            Delivery Confirmation
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Confirm Order Receipt
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Confirm that the package reached you and that its visible
            condition is acceptable.
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
          <input
            type="checkbox"
            checked={received}
            disabled={loading}
            onChange={(event) =>
              setReceived(
                event.target.checked
              )
            }
            className="mt-1 size-4 accent-[var(--color-success)]"
          />

          <span className="flex min-w-0 flex-1 items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]"
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                I received the order
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                The package reached the selected delivery address.
              </span>
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
          <input
            type="checkbox"
            checked={
              conditionConfirmed
            }
            disabled={loading}
            onChange={(event) =>
              setConditionConfirmed(
                event.target.checked
              )
            }
            className="mt-1 size-4 accent-[var(--color-success)]"
          />

          <span className="flex min-w-0 flex-1 items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-[var(--color-success)]"
            />

            <span>
              <span className="block text-sm font-medium text-foreground">
                Package condition is acceptable
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                The outer packaging and visible product condition have
                been reviewed.
              </span>
            </span>
          </span>
        </label>
      </div>

      <FormField
        label="Delivery Note"
        labelFor="order-delivery-note"
        optional
        description={`${deliveryNote.length}/2000 characters`}
      >
        <Textarea
          id="order-delivery-note"
          value={deliveryNote}
          rows={6}
          disabled={loading}
          maxLength={2000}
          placeholder="Share any final delivery observations."
          onChange={(event) =>
            setDeliveryNote(
              event.target.value
            )
          }
        />
      </FormField>

      <Alert
        variant="success"
        title="Confirmation completes fulfilment"
        description="The Studio will be notified and the protected order timeline will be updated."
        icon={
          <CheckCircle2
            aria-hidden="true"
            className="size-5"
          />
        }
      />

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Confirming Delivery"
          onClick={() => {
            void onSubmit({
              orderId,
              received: true,
              conditionConfirmed:
                true,
              deliveryNote:
                deliveryNote.trim() ||
                undefined,
            });
          }}
        >
          <CheckCircle2
            aria-hidden="true"
            className="size-4"
          />
          Confirm Delivery
        </Button>
      </div>
    </Surface>
  );
}
