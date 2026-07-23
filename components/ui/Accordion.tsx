"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  readonly items: readonly AccordionItem[];
  readonly allowMultiple?: boolean;
  readonly className?: string;
}

export function Accordion({
  allowMultiple = false,
  className,
  items,
}: AccordionProps): React.JSX.Element {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

 const toggle = (id: string): void => {
  setOpenItems((current) => {
   const next = allowMultiple ? new Set(current) : new Set<string>();

    if (current.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

     return next;
   });
 };

 return (
  <div

   className={cn(
     "divide-y divide-border overflow-hidden rounded-lg border border-border bg-cardshadow-[var(--shadow-card)]",
     className
   )}
  >
   {items.map((item) => {
     const open = openItems.has(item.id);
     const panelId = `${item.id}-panel`;

      return (
       <section key={item.id}>
         <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => toggle(item.id)}
          className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left
outline-none hover:bg-[color:rgb(200_169_106_/_0.06)] focus-visible:ring-2
focus-visible:ring-inset focus-visible:ring-[var(--color-gold-500)]"
         >
          <span className="font-medium text-foreground">
            {item.title}
          </span>

        <ChevronDown
         aria-hidden="true"
         className={cn(
           "size-4 shrink-0 text-muted transition-transform duration-[var(--duration-base)]",
           open && "rotate-180"
         )}
        />
       </button>

        {open ? (
          <div
            id={panelId}
            className="px-6 pb-6 text-sm leading-7 text-muted"
          >
            {item.content}
          </div>
        ) : null}
       </section>
     );

    })}
   </div>
 );
}
