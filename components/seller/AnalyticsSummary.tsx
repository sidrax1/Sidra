import {
  BadgeIndianRupee,
  Eye,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import { SellerMetricGrid, type SellerMetric } from "@/components/seller/SellerMetricGrid";
import { formatCurrency } from "@/lib/currency";
import type { StudioAnalytics } from "@/types/analytics";

interface AnalyticsSummaryProps {
  readonly analytics: StudioAnalytics;
}

export function AnalyticsSummary({
  analytics,
}: AnalyticsSummaryProps): React.JSX.Element {
  const metrics: readonly SellerMetric[] = [
   {
     id: "views",
     label: "Studio Views",
     value: analytics.views.current.toLocaleString("en-IN"),
     percentageChange: analytics.views.percentageChange,
     description: "Compared with previous period",
     icon: Eye,
   },
   {
     id: "orders",
     label: "Orders",
     value: analytics.orders.current.toLocaleString("en-IN"),
     percentageChange: analytics.orders.percentageChange,
     description: "Completed and active orders",
     icon: ShoppingBag,
   },
   {
     id: "conversion",
     label: "Conversion Rate",
     value: `${analytics.conversionRate.current.toFixed(1)}%`,
     percentageChange: analytics.conversionRate.percentageChange,
     description: "Visits resulting in purchase",
     icon: TrendingUp,
   },
   {
     id: "revenue",
     label: "Gross Revenue",
     value: formatCurrency(
       analytics.grossRevenuePaise.current / 100
     ),
     percentageChange:
       analytics.grossRevenuePaise.percentageChange,
     description: "Before fees and taxes",
     icon: BadgeIndianRupee,
   },

 ];

 return <SellerMetricGrid metrics={metrics} />;
}
