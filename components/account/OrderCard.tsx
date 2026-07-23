import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Package,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/account/OrderStatusBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { ACCOUNT_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderCardProps {
  readonly order: Order;
  readonly className?: string;
}

export function OrderCard({
  className,
  order,
}: OrderCardProps): React.JSX.Element {
  const previewItems =
   order.items.slice(0, 3);

 const remainingItems =
  Math.max(
    0,
    order.items.length -
     previewItems.length
  );

 return (
  <Card
    className={cn(
      "p-5 md:p-6",
      className
    )}
  >
    <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row
sm:items-center sm:justify-between">
      <div>
       <div className="flex flex-wrap items-center gap-3">
         <h3 className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground">
          Order #{order.orderNumber}
         </h3>

       <OrderStatusBadge
        status={order.status}
       />
      </div>

     <p className="mt-2 text-sm text-muted">
      Placed on{" "}
      {formatDate(order.createdAt)}
     </p>
    </div>

    <Price
     amount={order.pricing.totalPaise}
     size="lg"
    />
   </header>

    <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
     <div className="flex items-center">
      {previewItems.map(
        (item, index) => (
          <div
            key={`${item.product.productId}-${index}`}
            className={cn(
              "relative size-16 overflow-hidden rounded-md border-2 border-cardbg-[var(--color-gray-100)]",
              index > 0 && "-ml-3"
            )}
          >

             {item.product.imageURL ? (
               <Image
                src={item.product.imageURL}
                alt={item.product.title}
                fill
                sizes="64px"
                className="object-cover"
               />
             ):(
               <div className="flex size-full items-center justify-center">
                <Package
                  aria-hidden={true}
                  className="size-5 text-muted"
                />
               </div>
             )}
            </div>
        )
      )}

      {remainingItems > 0 ? (
        <span className="-ml-3 flex size-16 items-center justify-center rounded-md border-2
border-card bg-[var(--color-black-900)] text-sm font-semibold text-white">
          +{remainingItems}
        </span>
      ) : null}

      <div className="ml-5">
       <p className="text-sm font-medium text-foreground">
        {order.items.length}{" "}
        {order.items.length === 1
          ? "piece"
          : "pieces"}
       </p>

      <p className="mt-1 text-xs text-muted">
        Payment{" "}
        {order.paymentStatus}
      </p>
     </div>
    </div>

    <Button
     variant="outline"

      asChild
     >
      <Link
        href={ACCOUNT_ROUTES.ORDER_DETAILS(
          order.id
        )}
      >
        View Order
        <ArrowRight
          aria-hidden={true}
          className="size-4"
        />
      </Link>
     </Button>
    </div>
   </Card>
 );
}
