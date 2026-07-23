"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  ShieldAlert,
  XCircle,
} from "lucide-react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Select,
} from "@/components/ui/Select";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  OrderCancellationInput,
} from "@/lib/schemas/order";
import type {
  Order,
} from "@/types/order";

interface OrderCancellationDialogProps {
  readonly open: boolean;
  readonly order: Order | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: OrderCancellationInput
  ) => void | Promise<void>;
}

type CancellationReason =
  OrderCancellationInput["reason"];

const reasonOptions = [
  {
    value: "orderedByMistake",
    label: "Ordered by Mistake",
  },
  {
    value: "duplicateOrder",
    label: "Duplicate Order",
  },
  {
    value: "addressIssue",
    label: "Delivery Address Issue",
  },
  {
    value: "deliveryDelay",
    label: "Delivery Timeline Concern",
  },
  {
    value: "productUnavailable",
    label: "Product Unavailable",
  },
  {
    value: "sellerUnableToFulfil",
    label: "Studio Unable to Fulfil",
  },
  {
    value: "paymentIssue",
    label: "Payment Issue",
  },
  {
    value: "policyViolation",
    label: "Policy Violation",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export function OrderCancellationDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  order,
}: OrderCancellationDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState<CancellationReason>(
      "orderedByMistake"
    );

  const [
    explanation,
    setExplanation,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setReason(
      "orderedByMistake"
    );
    setExplanation("");
  }, [open, order?.id]);

  const cancellable =
    order !== null &&
    ![
      "shipped",
      "outForDelivery",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ].includes(order.status);

  const valid =
    cancellable &&
    explanation.trim().length >=
      10;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Cancel Order
          </DialogTitle>

          <DialogDescription>
            Submit a verified cancellation request for{" "}
            {order
              ? `order #${order.orderNumber}`
              : "this order"}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant="warning"
            title={
              cancellable
                ? "Cancellation may affect payment settlement"
                : "This order cannot be cancelled"
            }
            description={
              cancellable
                ? "The request will be evaluated against fulfilment progress and applicable refund rules."
                : "Orders already dispatched, delivered, returned or refunded require the return or support workflow."
            }
            icon={
              <ShieldAlert
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          <FormField
            label="Cancellation Reason"
            labelFor="order-cancellation-reason"
            required
          >
            <Select
              id="order-cancellation-reason"
              value={reason}
              options={reasonOptions}
              disabled={
                loading ||
                !cancellable
              }
              onChange={(event) =>
                setReason(
                  event.target
                    .value as CancellationReason
                )
              }
            />
          </FormField>

          <FormField
            label="Detailed Explanation"
            labelFor="order-cancellation-explanation"
            required
            description={`${explanation.length}/1500 characters`}
          >
            <Textarea
              id="order-cancellation-explanation"
              value={explanation}
              rows={7}
              disabled={
                loading ||
                !cancellable
              }
              minLength={10}
              maxLength={1500}
              onChange={(event) =>
                setExplanation(
                  event.target.value
                )
              }
            />
          </FormField>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep Order
          </Button>

          <Button
            variant="danger"
            disabled={!valid}
            loading={loading}
            loadingLabel="Submitting Cancellation"
            onClick={() => {
              if (!order) {
                return;
              }

              void onSubmit({
                orderId: order.id,
                reason,
                explanation:
                  explanation.trim(),
              });
            }}
          >
            <XCircle
              aria-hidden={true}
              className="size-4"
            />
            Request Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
