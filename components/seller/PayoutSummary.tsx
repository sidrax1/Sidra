import {
  Banknote,
  Clock3,
  CircleCheckBig,
  WalletCards,
} from "lucide-react";

import { SellerMetricGrid, type SellerMetric } from "@/components/seller/SellerMetricGrid";
import { formatCurrency } from "@/lib/currency";

interface PayoutSummaryProps {
  readonly availableBalancePaise: number;
  readonly pendingBalancePaise: number;
  readonly paidThisMonthPaise: number;
  readonly lifetimePaidPaise: number;
}

export function PayoutSummary({
  availableBalancePaise,
  lifetimePaidPaise,
  paidThisMonthPaise,
  pendingBalancePaise,
}: PayoutSummaryProps): React.JSX.Element {
  const metrics: readonly SellerMetric[] = [
    {
      id: "available",
      label: "Available Balance",
      value: formatCurrency(availableBalancePaise / 100),
      description: "Eligible for the next payout cycle",

     icon: WalletCards,
   },
   {
     id: "pending",
     label: "Pending Balance",
     value: formatCurrency(pendingBalancePaise / 100),
     description: "Awaiting delivery or settlement",
     icon: Clock3,
   },
   {
     id: "month",
     label: "Paid This Month",
     value: formatCurrency(paidThisMonthPaise / 100),
     description: "Successfully transferred",
     icon: Banknote,
   },
   {
     id: "lifetime",
     label: "Lifetime Paid",
     value: formatCurrency(lifetimePaidPaise / 100),
     description: "Total seller earnings transferred",
     icon: CircleCheckBig,
   },
 ];

 return <SellerMetricGrid metrics={metrics} />;
}
