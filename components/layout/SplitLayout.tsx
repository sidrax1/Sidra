import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  readonly primary: ReactNode;
  readonly secondary: ReactNode;
  readonly secondaryPosition?: "left" | "right";
  readonly className?: string;

}

export function SplitLayout({
  className,
  primary,
  secondary,
  secondaryPosition = "right",
}: SplitLayoutProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]",
       secondaryPosition === "left" &&
        "lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]",
       className
     )}
    >
     {secondaryPosition === "left" ? secondary : primary}
     {secondaryPosition === "left" ? primary : secondary}
    </div>
  );
}
