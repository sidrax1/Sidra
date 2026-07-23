"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  readonly items: readonly TabItem[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly className?: string;
}

export function Tabs({
  className,
  items,
  onValueChange,
  value,
}: TabsProps): React.JSX.Element {
  const activeItem =
    items.find((item) => item.value === value) ?? items[0];

 return (

  <div className={cn("grid gap-6", className)}>
   <div
    role="tablist"
    className="flex gap-2 overflow-x-auto rounded-full border border-border bg-card p-1
shadow-[var(--shadow-card)]"
   >
    {items.map((item) => (
      <button
        key={item.value}
        type="button"
        role="tab"
        aria-selected={item.value === activeItem?.value}
        disabled={item.disabled}
        onClick={() => onValueChange(item.value)}
        className={cn(
          "whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
          item.value === activeItem?.value
            ? "bg-[var(--color-gold-500)] text-[var(--color-black-900)]"
            : "text-muted hover:text-foreground",
          item.disabled && "cursor-not-allowed opacity-45"
        )}
      >
        {item.label}
      </button>
    ))}
   </div>

    {activeItem ? (
      <div
        role="tabpanel"
        tabIndex={0}
        className="outline-none"
      >
        {activeItem.content}
      </div>
    ) : null}
   </div>
 );
}
