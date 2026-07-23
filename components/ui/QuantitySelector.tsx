"use client";

import { Minus, Plus } from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";

interface QuantitySelectorProps {
  readonly value: number;
  readonly minimum?: number;
  readonly maximum?: number;
  readonly disabled?: boolean;
  readonly onChange: (value: number) => void;
}

export function QuantitySelector({
  disabled = false,
  maximum = 10,
  minimum = 1,
  onChange,
  value,
}: QuantitySelectorProps): React.JSX.Element {
  const decrease = (): void => {

   onChange(Math.max(minimum, value - 1));
 };

 const increase = (): void => {
   onChange(Math.min(maximum, value + 1));
 };

 return (
  <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1
shadow-[var(--shadow-card)]">
    <IconButton
     label="Decrease quantity"
     icon={<Minus aria-hidden={true} />}
     appearance="ghost"
     size="sm"
     disabled={disabled || value <= minimum}
     onClick={decrease}
    />

      <output
       aria-live="polite"
       className="min-w-8 text-center text-sm font-semibold text-foreground"
      >
       {value}
      </output>

    <IconButton
     label="Increase quantity"
     icon={<Plus aria-hidden={true} />}
     appearance="ghost"
     size="sm"
     disabled={disabled || value >= maximum}
     onClick={increase}
    />
   </div>
 );
}
