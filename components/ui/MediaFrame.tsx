import type {
  ReactNode,
} from "react";

import {
  cn,
} from "@/lib/utils";

interface MediaFrameProps {
  readonly children: ReactNode;
  readonly aspectRatio?: number;
  readonly variant?:
   | "clean"
   | "fineGold"
   | "floatingIvory"
   | "darkGallery";
  readonly className?: string;

}

const variantClasses = {
  clean:
    "border-border bg-card shadow-[var(--shadow-card)]",
  fineGold:
    "border-[color:rgb(200_169_106_/_0.42)] bg-card shadow-[var(--shadow-gold-glow)]",
  floatingIvory:
    "border-[var(--color-ivory-50)] bg-[var(--color-ivory-50)] p-2 shadow-[var(--shadow-hover)]",
  darkGallery:
    "border-[color:rgb(200_169_106_/_0.25)] bg-[var(--color-black-900)] p-2shadow-[var(--shadow-modal)]",
} as const;

export function MediaFrame({
  aspectRatio = 1,
  children,
  className,
  variant = "clean",
}: MediaFrameProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "relative overflow-hidden rounded-lg border",
       variantClasses[variant],
       className
     )}
     style={{
       aspectRatio,
     }}
    >
     <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
       {children}
     </div>
    </div>
  );
}
