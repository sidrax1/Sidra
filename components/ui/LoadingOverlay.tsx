import {
  Spinner,
} from "@/components/ui/Spinner";

import {
  cn,
} from "@/lib/utils";

interface LoadingOverlayProps {
  readonly visible: boolean;
  readonly label?: string;
  readonly className?: string;
}

export function LoadingOverlay({
  className,
  label = "Preparing your experience",
  visible,
}: LoadingOverlayProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

 return (
  <div
    role="status"
    aria-live="polite"
    className={cn(
      "absolute inset-0 z-40 flex items-center justify-center",
      "bg-[color:rgb(247_244_239_/_0.82)] backdrop-blur-md",
      "dark:bg-[color:rgb(17_17_17_/_0.82)]",
      className
    )}
  >
    <div className="flex flex-col items-center gap-4 rounded-lg border
border-[color:rgb(200_169_106_/_0.25)] bg-card px-8 py-7 shadow-[var(--shadow-modal)]">
      <Spinner
       size="lg"
       label={label}

      />

     <p className="text-sm font-medium text-foreground">
       {label}
     </p>
    </div>
   </div>
 );
}
