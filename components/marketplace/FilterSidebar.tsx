"use client";

import {
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  Checkbox,
} from "@/components/ui/Checkbox";

import {
  Separator,
} from "@/components/ui/Separator";

import {
  Slider,
} from "@/components/ui/Slider";

import {
  cn,
} from "@/lib/utils";

export interface MarketplaceFilterOption {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
}

export interface MarketplaceFilterState {
  readonly categoryIds: readonly string[];
  readonly studioIds: readonly string[];
  readonly minimumPrice: number;
  readonly maximumPrice: number;
  readonly minimumRating: number;
  readonly inStockOnly: boolean;
  readonly featuredOnly: boolean;
}

interface FilterSidebarProps {
  readonly filters: MarketplaceFilterState;

    readonly categories: readonly MarketplaceFilterOption[];
    readonly studios?: readonly MarketplaceFilterOption[];
    readonly priceMinimum?: number;
    readonly priceMaximum?: number;
    readonly disabled?: boolean;
    readonly className?: string;
    readonly onChange: (
      filters: MarketplaceFilterState
    ) => void;
    readonly onReset: () => void;
}

function toggleValue(
  values: readonly string[],
  value: string
): string[] {
  return values.includes(value)
   ? values.filter(
       (currentValue) =>
         currentValue !== value
     )
   : [...values, value];
}

export function FilterSidebar({
  categories,
  className,
  disabled = false,
  filters,
  onChange,
  onReset,
  priceMaximum = 1_000_000,
  priceMinimum = 0,
  studios = [],
}: FilterSidebarProps): React.JSX.Element {
  const updateFilter = <
    Key extends keyof MarketplaceFilterState,
  >(
    key: Key,
    value: MarketplaceFilterState[Key]
  ): void => {
    onChange({
      ...filters,
      [key]: value,

   });
 };

 return (
   <aside
    aria-label="Marketplace filters"
    className={cn(
      "rounded-[var(--radius-lg)] border border-border bg-card",
      "shadow-[var(--shadow-card)]",
      className
    )}
   >
    <header className="flex items-center justify-between gap-4 px-5 py-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
         <SlidersHorizontal
          aria-hidden="true"
          className="size-4"
         />
        </span>

          <div>
           <h2 className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground">
            Refine
           </h2>

           <p className="text-xs text-muted">
             Curate your discovery
           </p>
          </div>
         </div>

         <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onReset}
         >
          <RotateCcw
           aria-hidden="true"
           className="size-3.5"
          />

  Reset
 </Button>
</header>

<Separator />

<div className="grid gap-7 p-5">
 <fieldset
  disabled={disabled}
  className="grid gap-4"
 >
  <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
    Availability
  </legend>

  <Checkbox
   checked={filters.inStockOnly}
   label="In stock only"
   description="Show pieces available for immediate order."
   onChange={(event) =>
     updateFilter(
       "inStockOnly",
       event.target.checked
     )
   }
  />

  <Checkbox
    checked={filters.featuredOnly}
    label="Sidra selections"
    description="Show only hand-curated featured pieces."
    onChange={(event) =>
      updateFilter(
        "featuredOnly",
        event.target.checked
      )
    }
  />
 </fieldset>

 <Separator />

 <fieldset
  disabled={disabled}

 className="grid gap-4"
>
 <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
  Categories
 </legend>

 <div className="grid gap-3">
   {categories.map(
     (category) => (
       <Checkbox
        key={category.id}
        checked={filters.categoryIds.includes(
          category.id
        )}
        label={category.label}
        description={
          typeof category.count ===
          "number"
            ? `${category.count.toLocaleString("en-IN")} pieces`
            : undefined
        }
        onChange={() =>
          updateFilter(
            "categoryIds",
            toggleValue(
              filters.categoryIds,
              category.id
            )
          )
        }
       />
     )
   )}
 </div>
</fieldset>

{studios.length > 0 ? (
 <>
   <Separator />

  <fieldset
   disabled={disabled}
   className="grid gap-4"
  >

   <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
    Studios
   </legend>

     <div className="grid max-h-72 gap-3 overflow-y-auto pr-1">
       {studios.map(
         (studio) => (
           <Checkbox
            key={studio.id}
            checked={filters.studioIds.includes(
              studio.id
            )}
            label={studio.label}
            description={
              typeof studio.count ===
              "number"
                ? `${studio.count.toLocaleString("en-IN")} pieces`
                : undefined
            }
            onChange={() =>
              updateFilter(
                "studioIds",
                toggleValue(
                  filters.studioIds,
                  studio.id
                )
              )
            }
           />
         )
       )}
     </div>
    </fieldset>
  </>
) : null}

<Separator />

<fieldset
 disabled={disabled}
 className="grid gap-5"
>
 <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
   Price

     </legend>

     <Slider
      minimum={priceMinimum}
      maximum={priceMaximum}
      value={[
        filters.minimumPrice,
        filters.maximumPrice,
      ]}
      step={100}
      onValueChange={(
        nextValue
      ) =>
        onChange({
          ...filters,
          minimumPrice:
            nextValue[0] ??
            priceMinimum,
          maximumPrice:
            nextValue[1] ??
            priceMaximum,
        })
      }
     />

       <div className="flex items-center justify-between gap-4 text-sm">
        <span className="rounded-full border border-border bg-background px-3 py-1.5
text-foreground">
         ₹
         {filters.minimumPrice.toLocaleString(
           "en-IN"
         )}
        </span>

       <span className="text-muted">
        to
       </span>

        <span className="rounded-full border border-border bg-background px-3 py-1.5
text-foreground">
         ₹
         {filters.maximumPrice.toLocaleString(
           "en-IN"
         )}

   </span>
 </div>
</fieldset>

<Separator />

<fieldset
 disabled={disabled}
 className="grid gap-4"
>
 <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
   Minimum rating
 </legend>

 {[4, 3, 2, 1].map(
   (rating) => (
     <label
      key={rating}
      className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
     >
      <input
        type="radio"
        name="minimum-rating"
        value={rating}
        checked={
          filters.minimumRating ===
          rating
        }
        onChange={() =>
          updateFilter(
            "minimumRating",
            rating
          )
        }
        className="size-4 accent-[var(--color-gold-500)]"
      />

        <span>
          {rating} stars & above
        </span>
       </label>
   )
 )}

       <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
        <input
          type="radio"
          name="minimum-rating"
          value={0}
          checked={
            filters.minimumRating === 0
          }
          onChange={() =>
            updateFilter(
              "minimumRating",
              0
            )
          }
          className="size-4 accent-[var(--color-gold-500)]"
        />

        <span>All ratings</span>
      </label>
     </fieldset>
    </div>
   </aside>
 );
}
