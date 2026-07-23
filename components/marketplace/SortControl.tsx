"use client";

import {
  ArrowDownAZ,
} from "lucide-react";

import {
  Select,
  type SelectOption,
} from "@/components/ui/Select";

import {
  cn,
} from "@/lib/utils";

export type MarketplaceSortValue =
 | "featured"
 | "newest"
 | "priceLowToHigh"
 | "priceHighToLow"
 | "rating"
 | "popularity";

interface SortControlProps {
  readonly value: MarketplaceSortValue;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    value: MarketplaceSortValue
  ) => void;
}

const options: readonly SelectOption[] =

 [
     {
     value: "featured",
     label: "Featured",
   },
   {
     value: "newest",
     label: "Newest arrivals",
   },
   {
     value: "priceLowToHigh",
     label: "Price: Low to high",
   },
   {
     value: "priceHighToLow",
     label: "Price: High to low",
   },
   {
     value: "rating",
     label: "Highest rated",
   },
   {
     value: "popularity",
     label: "Most popular",
   },
 ];

export function SortControl({
  className,
  disabled = false,
  onChange,
  value,
}: SortControlProps): React.JSX.Element {
  return (
   <div
     className={cn(
       "flex items-center gap-3",
       className
     )}
   >
     <ArrowDownAZ
       aria-hidden={true}
       className="hidden size-4 text-muted sm:block"
     />

      <label className="sr-only">
       Sort products
      </label>

    <Select
     value={value}
     options={options}
     disabled={disabled}
     aria-label="Sort products"
     onChange={(event) =>
       onChange(
         event.target
          .value as MarketplaceSortValue
       )
     }
     className="min-w-52"
    />
   </div>
 );
}
