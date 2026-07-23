import { Timeline } from "@/components/ui/Timeline";
import { formatDateTime } from "@/lib/date";
import type { Order } from "@/types/order";

interface OrderTimelineProps {
  readonly order: Order;
}

const statusSequence: readonly Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

const labels: Record<

  Order["status"],
  string
>={
  pending: "Order received",
  confirmed: "Order confirmed",
  processing: "Crafting in progress",
  shipped: "Dispatched",
  delivered: "Delivered",
  cancelled: "Order cancelled",
  refunded: "Payment refunded",
};

export function OrderTimeline({
  order,
}: OrderTimelineProps): React.JSX.Element {
  const currentIndex =
   statusSequence.indexOf(
     order.status
   );

 const terminalStatus =
  order.status === "cancelled" ||
  order.status === "refunded";

 const items = terminalStatus
  ?[
    {
      id: "received",
      title: labels.pending,
      completed: true,
      timestamp: formatDateTime(
        order.createdAt
      ),
    },
    {
      id: order.status,
      title: labels[order.status],
      active: true,
      description:
        order.status ===
        "cancelled"
          ? "This order was cancelled."
          : "The payment has been refunded.",
      timestamp: formatDateTime(

            order.updatedAt
          ),
        },
        ]
      : statusSequence.map(
          (status, index) => ({
            id: status,
            title: labels[status],
            completed:
              index < currentIndex,
            active:
              index === currentIndex,
            timestamp:
              index === 0
                ? formatDateTime(
                    order.createdAt
                  )
                : undefined,
          })
        );

 return <Timeline items={items} />;
}
