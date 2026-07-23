import {
  Boxes,
  MessageSquareWarning,
  Store,
  UserRoundCog,
} from "lucide-react";

import {
  AdminMetricGrid,
  type AdminMetric,
} from "@/components/admin/AdminMetricGrid";

interface ModerationQueueSummaryProps {
  readonly sellerApplications: number;
  readonly products: number;
  readonly supportTickets: number;
  readonly studios: number;
}

export function ModerationQueueSummary({
  products,
  sellerApplications,
  studios,
  supportTickets,
}: ModerationQueueSummaryProps): React.JSX.Element {
  const metrics: readonly AdminMetric[] = [
   {
     id: "seller-applications",
     label: "Seller Applications",
     value: sellerApplications.toLocaleString("en-IN"),
     description: "Awaiting review",
     icon: UserRoundCog,
   },
   {
     id: "product-moderation",
     label: "Product Moderation",

     value: products.toLocaleString("en-IN"),
     description: "Awaiting decision",
     icon: Boxes,
   },
   {
     id: "studio-reviews",
     label: "Studio Reviews",
     value: studios.toLocaleString("en-IN"),
     description: "Verification required",
     icon: Store,
   },
   {
     id: "support-tickets",
     label: "Support Tickets",
     value: supportTickets.toLocaleString("en-IN"),
     description: "Unresolved requests",
     icon: MessageSquareWarning,
   },
 ];

  return <AdminMetricGrid metrics={metrics} />;
}
