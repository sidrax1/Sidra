import { Timeline } from "@/components/ui/Timeline";
import { formatDateTime } from "@/lib/date";
import type {
  CustomOrder,
  CustomOrderStatus,
} from "@/types/custom-order";

interface CustomOrderTimelineProps {
  readonly customOrder: CustomOrder;
}

const sequence: readonly CustomOrderStatus[] = [
  "submitted",
  "underReview",
  "awaitingQuote",
  "quoted",
  "quoteAccepted",
  "paymentPending",
  "paid",
  "inProduction",
  "readyForDispatch",
  "shipped",
  "delivered",
];

const labels: Record<
  CustomOrderStatus,
  string
> = {
  submitted: "Request Submitted",
  underReview: "Studio Review",
  awaitingQuote: "Awaiting Quote",
  quoted: "Quote Prepared",
  quoteAccepted: "Quote Accepted",
  paymentPending: "Payment Pending",
  paid: "Payment Received",
  inProduction: "Crafting in Progress",
  readyForDispatch: "Ready for Dispatch",
  shipped: "Dispatched",
  delivered: "Commission Delivered",
  declined: "Request Declined",
  cancelled: "Commission Cancelled",
};

const descriptions: Record<
  CustomOrderStatus,
  string
> = {
  submitted:
    "The private commission request has been securely received.",
  underReview:
    "The studio is reviewing design, material and timeline requirements.",
  awaitingQuote:
    "The studio is preparing a formal commercial quotation.",
  quoted:
    "A formal commercial quotation is ready for review.",
  quoteAccepted:
    "The quotation has been accepted and payment preparation may begin.",
  paymentPending:
    "Awaiting payment to begin the commission.",
  paid:
    "Payment has been received and production can begin.",
  inProduction:
    "The personalised piece is currently being crafted.",
  readyForDispatch:
    "The commission is complete and ready for dispatch.",
  shipped:
    "The commission has been dispatched.",
  delivered:
    "The custom commission has been delivered.",
  declined:
    "The studio was unable to accept this commission.",
  cancelled:
    "The commission workflow was cancelled.",
};

export function CustomOrderTimeline({
  customOrder,
}: CustomOrderTimelineProps): React.JSX.Element {
  const terminal =
    customOrder.status ===
      "cancelled" ||
    customOrder.status ===
      "declined";

  if (terminal) {
    return (
      <Timeline
        items={[
          {
            id: "submitted",
            title: labels.submitted,
            description:
              descriptions.submitted,
            completed: true,
            timestamp:
              formatDateTime(
                customOrder.createdAt
              ),
          },
          {
            id: customOrder.status,
            title:
              labels[
                customOrder.status
              ],
            description:
              descriptions[
                customOrder.status
              ],
            active: true,
            timestamp:
              formatDateTime(
                customOrder.updatedAt
              ),
          },
        ]}
      />
    );
  }

  const currentIndex =
    sequence.indexOf(
      customOrder.status
    );

  return (
    <Timeline
      items={sequence.map(
        (status, index) => ({
          id: status,
          title: labels[status],
          description:
            descriptions[status],
          completed:
            index < currentIndex,
          active:
            index === currentIndex,
          timestamp:
            index === 0
              ? formatDateTime(
                  customOrder.createdAt
                )
              : index ===
                  currentIndex
                ? formatDateTime(
                    customOrder.updatedAt
                  )
                : undefined,
        })
      )}
    />
  );
}
