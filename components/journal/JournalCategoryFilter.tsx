"use client";

import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

export interface JournalCategoryOption {
 readonly id: string;

    readonly label: string;
    readonly count?: number;
}

interface JournalCategoryFilterProps {
  readonly categories: readonly JournalCategoryOption[];
  readonly selectedCategoryId?: string | null;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (
    categoryId: string | null
  ) => void;
}

export function JournalCategoryFilter({
  categories,
  className,
  disabled = false,
  onChange,
  selectedCategoryId,
}: JournalCategoryFilterProps): React.JSX.Element {
  return (
   <div
     role="list"
     aria-label="Journal categories"
     className={cn(
       "flex flex-wrap gap-2",
       className
     )}
   >
     <Chip
       label="All Stories"
       selected={!selectedCategoryId}
       disabled={disabled}
       onClick={() => onChange(null)}
     />

      {categories.map(
       (category) => (
        <Chip
          key={category.id}
          label={
            category.count === undefined
             ? category.label

            : `${category.label} (${category.count})`
       }
       selected={
         selectedCategoryId ===
         category.id
       }
       disabled={disabled}
       onClick={() =>
         onChange(category.id)
       }
      />
      )
    )}
   </div>
 );
}
