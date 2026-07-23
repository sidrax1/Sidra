"use client";

import {
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import {
  Input,
} from "@/components/ui/Input";

import {
  normalizeSearchText,
} from "@/lib/search-normalization";

import {

  cn,
} from "@/lib/utils";

export interface CommandPaletteItem {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly icon?: ReactNode;
  readonly disabled?: boolean;
  readonly onSelect: () => void;
}

interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly items: readonly CommandPaletteItem[];
  readonly placeholder?: string;
}

export function CommandPalette({
  items,
  onOpenChange,
  open,
  placeholder = "Search commands, products and settings...",
}: CommandPaletteProps): React.JSX.Element {
  const [query, setQuery] = useState("");

 const filteredItems = useMemo(() => {
  const normalizedQuery =
   normalizeSearchText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
   const searchableText =
     normalizeSearchText(
      [
        item.label,
        item.description,
        ...(item.keywords ?? []),
      ]

        .filter(Boolean)
        .join(" ")
   );

    return searchableText.includes(
      normalizedQuery
    );
  });
}, [items, query]);

return (
 <Dialog
   open={open}
   onOpenChange={onOpenChange}
 >
   <DialogContent className="max-w-2xl p-0">
    <DialogHeader className="border-b border-border p-5">
     <DialogTitle>
       Sidra Command Centre
     </DialogTitle>
    </DialogHeader>

   <div className="relative px-5 pt-5">
    <Search
     aria-hidden={true}
     className="absolute left-9 top-1/2 mt-2 size-4 -translate-y-1/2 text-muted"
    />

    <Input
     value={query}
     onChange={(event) =>
       setQuery(event.target.value)
     }
     placeholder={placeholder}
     autoFocus
     className="pl-11"
    />
   </div>

   <div className="max-h-[420px] overflow-y-auto p-5">
    {filteredItems.length > 0 ? (
      <div className="grid gap-2">
        {filteredItems.map((item) => (
          <button

              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                onOpenChange(false);
              }}
              className={cn(
                "flex w-full items-center gap-4 rounded-md border border-transparent px-4 py-3text-left",
             "transition-colors hover:border-[color:rgb(200_169_106_/_0.2)]hover:bg-[color:rgb(200_169_106_/_0.08)]",
             "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
             item.disabled &&
               "pointer-events-none opacity-45"
           )}
          >
           {item.icon ? (
             <span className="text-[var(--color-gold-600)]">
               {item.icon}
             </span>
           ) : null}

              <span className="min-w-0">
               <span className="block font-medium text-foreground">
                {item.label}
               </span>

              {item.description ? (
                <span className="mt-1 block text-sm leading-5 text-muted">
                  {item.description}
                </span>
              ) : null}
             </span>
           </button>
         ))}
        </div>
       ):(
        <div className="py-14 text-center">
         <p className="font-heading text-2xl text-foreground">
           No matching command
         </p>

          <p className="mt-2 text-sm text-muted">

          Refine your search and try again.
         </p>
        </div>
      )}
     </div>
    </DialogContent>
   </Dialog>
 );
}
