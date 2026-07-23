import {
  CalendarDays,
  CircleDollarSign,
  ReceiptText,
} from "lucide-react";

import { PayoutStatusBadge } from "@/components/seller/PayoutStatusBadge";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { Separator } from "@/components/ui/Separator";
import { formatDate } from "@/lib/date";
import type { Payout } from "@/types/payout";

interface PayoutCardProps {
  readonly payout: Payout;
}

export function PayoutCard({
  payout,
}: PayoutCardProps): React.JSX.Element {
  return (
   <Card className="p-6">
     <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
       <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
         <CircleDollarSign
           aria-hidden="true"
           className="size-5"
         />
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
         <CalendarDays
           aria-hidden="true"
           className="size-3.5"
         />
         Created {formatDate(payout.createdAt)}

    </span>

     <span className="inline-flex items-center gap-2">
      <ReceiptText
        aria-hidden="true"
        className="size-3.5"
      />
      {payout.orderIds.length.toLocaleString("en-IN")} orders
     </span>
   </div>
  </div>
 </div>

 <Price
  amount={payout.netAmountPaise / 100}
  size="lg"
 />
</header>

<Separator className="my-5" />

<div className="grid gap-4 text-sm sm:grid-cols-4">
 <div>
  <p className="text-muted">Gross</p>
  <p className="mt-1 font-medium text-foreground">
    ₹{(payout.grossAmountPaise / 100).toLocaleString("en-IN")}
  </p>
 </div>

 <div>
  <p className="text-muted">Platform Fee</p>
  <p className="mt-1 font-medium text-foreground">
   ₹{(payout.platformFeePaise / 100).toLocaleString("en-IN")}
  </p>
 </div>

 <div>
  <p className="text-muted">Tax</p>
  <p className="mt-1 font-medium text-foreground">
   ₹{(payout.taxAmountPaise / 100).toLocaleString("en-IN")}
  </p>
 </div>

 <div>

      <p className="text-muted">Adjustments</p>
      <p className="mt-1 font-medium text-foreground">
        ₹{(payout.adjustmentAmountPaise / 100).toLocaleString("en-IN")}
      </p>
     </div>
    </div>
   </Card>
 );
}
