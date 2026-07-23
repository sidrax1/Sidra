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
  "reviewing",
  "quoted",
  "accepted",
  "inProduction",
  "completed",
];

const labels: Record<
  CustomOrderStatus,
  string
> = {
  submitted: "Request Submitted",
  reviewing: "Studio Review",
  quoted: "Quote Prepared",
  accepted: "Quote Accepted",
  inProduction: "Crafting in Progress",
  completed: "Commission Completed",
  cancelled: "Commission Cancelled",
  rejected: "Request Declined",
};

const descriptions: Record<
  CustomOrderStatus,
  string
> = {
  submitted:
    "The private commission request has been securely received.",
  reviewing:
    "The studio is reviewing design, material and timeline requirements.",
  quoted:
    "A formal commercial quotation is ready for review.",
  accepted:
    "The quotation has been accepted and payment preparation may begin.",
  inProduction:
    "The personalised piece is currently being crafted.",
  completed:
    "The custom commission has been completed.",
  cancelled:
    "The commission workflow was cancelled.",
  rejected:
    "The studio was unable to accept this commission.",
};

export function CustomOrderTimeline({
  customOrder,
}: CustomOrderTimelineProps): React.JSX.Element {
  const terminal =
    customOrder.status ===
      "cancelled" ||
    customOrder.status ===
      "rejected";

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
