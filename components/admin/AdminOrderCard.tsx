"use client";

import {
  ArrowRight,
  CreditCard,
  Package,
  Store,
  UserRound,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import type { Order } from "@/types/order";

interface AdminOrderCardProps {
  readonly order: Order;
  readonly customerName: string;
  readonly studioNames: readonly string[];
  readonly onView: (order: Order) => void;
}

export function AdminOrderCard({
  customerName,
  onView,
  order,
  studioNames,
}: AdminOrderCardProps): React.JSX.Element {
  return (
   <Card className="p-6">
     <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
      <div>
       <div className="flex flex-wrap items-center gap-3">
         <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
           Order #{order.orderNumber}
         </h3>

       <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
       <span className="inline-flex items-center gap-2">
        <UserRound aria-hidden={true} className="size-3.5" />
        {customerName}
       </span>

       <span className="inline-flex items-center gap-2">
        <Store aria-hidden={true} className="size-3.5" />
        {studioNames.join(", ")}
       </span>

       <span className="inline-flex items-center gap-2">
        <Package aria-hidden={true} className="size-3.5" />
        {order.items.length.toLocaleString("en-IN")} items
       </span>

       <span className="inline-flex items-center gap-2">
        <CreditCard aria-hidden={true} className="size-3.5" />
        {order.payment.status}
       </span>

       <span>{formatDateTime(order.createdAt)}</span>
      </div>
     </div>

      <div className="flex flex-wrap items-center gap-4">
       <Price amount={order.grandTotal} size="lg" />

      <Button
        variant="outline"
        onClick={() => onView(order)}
      >
        View Order
        <ArrowRight aria-hidden={true} className="size-4" />
      </Button>
     </div>
    </div>
   </Card>
 );
}
