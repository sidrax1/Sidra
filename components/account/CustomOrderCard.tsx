import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Gem,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ACCOUNT_ROUTES } from "@/constants/routes";
import { formatDate } from "@/lib/date";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderCardProps {
  readonly customOrder: CustomOrder;
}

export function CustomOrderCard({
  customOrder,
}: CustomOrderCardProps): React.JSX.Element {
  return (
   <Card className="p-6">
     <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-4">
       <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
         <Gem
           aria-hidden={true}
           className="size-5"
         />
       </span>

      <div>
       <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-heading text-3xl font-medium tracking-[-0.03em]">
          {customOrder.title}
        </h3>

         <Badge variant="gold">
          {customOrder.status}
         </Badge>

  </div>

  <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-7 text-muted">
   {customOrder.description}
  </p>

  <div className="mt-4 flex flex-wrap gap-5 text-xs text-muted">
   <span>
    Quantity{" "}
    {customOrder.quantity.toLocaleString(
      "en-IN"
    )}
   </span>

   <span>
    Submitted{" "}
    {formatDate(
      customOrder.createdAt
    )}
   </span>

    {customOrder.requiredBy ? (
      <span className="inline-flex items-center gap-2">
        <CalendarDays
          aria-hidden={true}
          className="size-3.5"
        />
        Required by{" "}
        {formatDate(
          customOrder.requiredBy
        )}
      </span>
    ) : null}
  </div>
 </div>
</div>

<Button
 variant="outline"
 asChild
>
 <Link
  href={ACCOUNT_ROUTES.CUSTOM_ORDER_DETAILS(
   customOrder.id

        )}
      >
        View Request
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
