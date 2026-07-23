import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChipProps {
  readonly label: string;
  readonly selected?: boolean;
  readonly removable?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
  readonly onRemove?: () => void;
  readonly className?: string;
}

export function Chip({
  className,
  disabled = false,
  label,
  onClick,
  onRemove,
  removable = false,
  selected = false,
}: ChipProps): React.JSX.Element {
  return (
    <span
     className={cn(
       "inline-flex items-center overflow-hidden rounded-full border text-sm",
       selected
         ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
         : "border-border bg-card text-foreground",
       disabled && "pointer-events-none opacity-45",
       className
     )}
    >
     <button
       type="button"
       disabled={disabled || !onClick}
       onClick={onClick}
       className="px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-inset
focus-visible:ring-[var(--color-gold-500)]"
     >
       {label}
     </button>

     {removable ? (
       <button
         type="button"
         disabled={disabled}
         onClick={onRemove}
         aria-label={`Remove ${label}`}
         className="mr-1 inline-flex size-7 items-center justify-center rounded-full outline-none
hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[var(--color-gold-500)]
dark:hover:bg-white/5"
       >
         <X aria-hidden={true} className="size-3.5" />
       </button>
     ) : null}
    </span>
  );
}
