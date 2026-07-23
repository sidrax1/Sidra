import { Badge } from "@/components/ui/Badge";

export type SupportPriority =
 | "low"
 | "normal"
 | "high"
 | "urgent";

interface SupportPriorityBadgeProps {
  readonly priority: SupportPriority;
}

const priorityLabels: Record<
  SupportPriority,
  string
>={
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export function SupportPriorityBadge({
  priority,
}: SupportPriorityBadgeProps): React.JSX.Element {
  const variant =
   priority === "urgent"

      ? "error"
      : priority === "high"
        ? "warning"
        : priority === "normal"
          ? "gold"
          : "neutral";

 return (
   <Badge variant={variant}>
    {priorityLabels[priority]}
   </Badge>
 );
}
