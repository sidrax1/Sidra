import type { ReactNode } from "react";

import { CustomOrderCard } from "@/components/account/CustomOrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CustomOrder } from "@/types/custom-order";

interface CustomOrderListProps {
  readonly customOrders: readonly CustomOrder[];
  readonly emptyAction?: ReactNode;
}

export function CustomOrderList({
  customOrders,
  emptyAction,
}: CustomOrderListProps): React.JSX.Element {
  if (
    customOrders.length === 0
  ){
    return (
       <EmptyState
        title="No custom requests"
        description="Commission a personalized resin piece crafted around your story."
        action={emptyAction}
       />

      );
 }

 return (
   <div className="grid gap-5">
    {customOrders.map(
      (customOrder) => (
        <CustomOrderCard
         key={customOrder.id}
         customOrder={
           customOrder
         }
        />
      )
    )}
   </div>
 );
}
