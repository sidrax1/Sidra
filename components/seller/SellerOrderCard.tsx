"use client";

import {
  ArrowRight,
  PackageCheck,
  Truck,
} from "lucide-react";

import { SellerOrderStatusBadge } from "@/components/seller/SellerOrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import type { Order } from "@/types/order";

interface SellerOrderCardProps {

    readonly order: Order;
    readonly loading?: boolean;
    readonly onView: (order: Order) => void;
    readonly onStartProcessing?: (order: Order) => void | Promise<void>;
    readonly onMarkShipped?: (order: Order) => void | Promise<void>;
}

export function SellerOrderCard({
  loading = false,
  onMarkShipped,
  onStartProcessing,
  onView,
  order,
}: SellerOrderCardProps): React.JSX.Element {
  return (
    <Card className="p-5 md:p-6">
     <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="min-w-0">
       <div className="flex flex-wrap items-center gap-3">
         <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
           Order #{order.orderNumber}
         </h3>

         <SellerOrderStatusBadge status={order.status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
         <span>
          {order.items.length}{" "}
          {order.items.length === 1 ? "piece" : "pieces"}
         </span>

          <span>
           Placed {formatDateTime(order.createdAt)}
          </span>

         <span>
           Payment {order.payment.status}
         </span>
        </div>
       </div>

       <div className="flex flex-wrap items-center gap-3">
        <Price

       amount={order.grandTotal}
       size="lg"
       className="mr-2"
      />

      {order.status === "confirmed" && onStartProcessing ? (
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => {
            void onStartProcessing(order);
          }}
        >
          <PackageCheck aria-hidden="true" />
          Start Production
        </Button>
      ) : null}

      {order.status === "processing" && onMarkShipped ? (
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => {
            void onMarkShipped(order);
          }}
        >
          <Truck aria-hidden="true" />
          Mark Shipped
        </Button>
      ) : null}

      <Button
        disabled={loading}
        onClick={() => onView(order)}
      >
        View Order
        <ArrowRight aria-hidden="true" />
      </Button>
     </div>
    </div>
   </Card>
 );
}
