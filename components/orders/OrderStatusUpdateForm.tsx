"use client";

import {
  useState,
} from "react";
import {
  PackageCheck,
  Send,
  Truck,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Select,
} from "@/components/ui/Select";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  OrderStatusUpdateInput,
} from "@/lib/schemas/order";

interface OrderStatusUpdateFormProps {
  readonly orderId: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: OrderStatusUpdateInput
  ) => void | Promise<void>;
}

type UpdateStatus =
  OrderStatusUpdateInput["status"];

const statusOptions = [
  {
    value: "confirmed",
    label: "Order Confirmed",
  },
  {
    value: "processing",
    label: "Production Started",
  },
  {
    value: "readyToShip",
    label: "Ready to Ship",
  },
  {
    value: "shipped",
    label: "Dispatched",
  },
  {
    value: "outForDelivery",
    label: "Out for Delivery",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
] as const;

export function OrderStatusUpdateForm({
  loading = false,
  onSubmit,
  orderId,
}: OrderStatusUpdateFormProps): React.JSX.Element {
  const [status, setStatus] =
    useState<UpdateStatus>(
      "confirmed"
    );

  const [message, setMessage] =
    useState("");

  const [
    customerVisible,
    setCustomerVisible,
  ] = useState(true);

  const valid =
    message.trim().length >= 5;

  const StatusIcon =
    status === "shipped" ||
    status === "outForDelivery"
      ? Truck
      : PackageCheck;

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <StatusIcon
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Fulfilment Control
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Update Order Status
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Publish a verified fulfilment milestone to the order
            timeline.
          </p>
        </div>
      </header>

      <FormField
        label="New Status"
        labelFor="order-status-update"
        required
      >
        <Select
          id="order-status-update"
          value={status}
          options={statusOptions}
          disabled={loading}
          onChange={(event) =>
            setStatus(
              event.target
                .value as UpdateStatus
            )
          }
        />
      </FormField>

      <FormField
        label="Status Message"
        labelFor="order-status-message"
        required
        description={`${message.length}/1500 characters`}
      >
        <Textarea
          id="order-status-message"
          value={message}
          rows={7}
          disabled={loading}
          minLength={5}
          maxLength={1500}
          placeholder="Explain the current fulfilment milestone."
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
        />
      </FormField>

      <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
        <input
          type="checkbox"
          checked={
            customerVisible
          }
          disabled={loading}
          onChange={(event) =>
            setCustomerVisible(
              event.target.checked
            )
          }
          className="mt-1 size-4 accent-[var(--color-gold-500)]"
        />

        <span>
          <span className="block text-sm font-medium text-foreground">
            Visible to customer
          </span>

          <span className="mt-1 block text-xs leading-5 text-muted">
            Publish this milestone in the customer order timeline and
            notification feed.
          </span>
        </span>
      </label>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Publishing Status"
          onClick={() => {
            void Promise.resolve(
              onSubmit({
                orderId,
                status,
                message:
                  message.trim(),
                customerVisible,
              })
            ).then(() => {
              setMessage("");
            });
          }}
        >
          <Send
            aria-hidden={true}
            className="size-4"
          />
          Publish Status
        </Button>
      </div>
    </Surface>
  );
}
