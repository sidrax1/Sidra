"use client";

import {
  ArrowRight,
  CircleDollarSign,
  Store,
} from "lucide-react";

import { PayoutStatusBadge } from "@/components/seller/PayoutStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";

import { formatDate } from "@/lib/date";
import type { Payout } from "@/types/payout";

interface AdminPayoutCardProps {
  readonly payout: Payout;
  readonly studioName: string;
  readonly loading?: boolean;
  readonly onView: (payout: Payout) => void;
  readonly onApprove?: (payout: Payout) => void | Promise<void>;
}

export function AdminPayoutCard({
  loading = false,
  onApprove,
  onView,
  payout,
  studioName,
}: AdminPayoutCardProps): React.JSX.Element {
  return (
    <Card className="p-6">
     <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-start gap-4">
       <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
         <CircleDollarSign aria-hidden="true" className="size-5" />
       </span>

      <div>
       <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
          Payout #{payout.id.slice(0, 8).toUpperCase()}
        </h3>

        <PayoutStatusBadge status={payout.status} />
       </div>

       <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
         <Store aria-hidden="true" className="size-3.5" />
         {studioName}
        </span>

        <span>{payout.orderIds.length} orders</span>

          <span>Created {formatDate(payout.createdAt)}</span>
        </div>
       </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
       <Price
        amount={payout.netAmountPaise / 100}
        size="lg"
       />

         {payout.status === "pending" && onApprove ? (
           <Button
             disabled={loading}
             loading={loading}
             loadingLabel="Approving"
             onClick={() => {
               void onApprove(payout);
             }}
           >
             Approve
           </Button>
         ) : null}

      <Button
        variant="outline"
        disabled={loading}
        onClick={() => onView(payout)}
      >
        Review
        <ArrowRight aria-hidden="true" className="size-4" />
      </Button>
     </div>
    </div>
   </Card>
 );
}
