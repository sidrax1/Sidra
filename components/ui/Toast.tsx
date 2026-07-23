"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

export type ToastVariant =
 | "success"
 | "error"
 | "warning"
 | "info";

export interface ToastInput {
  readonly title: string;
  readonly description?: string;
  readonly variant?: ToastVariant;
  readonly duration?: number;
}

interface ToastItem extends ToastInput {
  readonly id: string;
}

interface ToastContextValue {
  readonly showToast: (
    input: ToastInput
  ) => string;
  readonly dismissToast: (
    toastId: string
  ) => void;
}

const ToastContext =
 createContext<ToastContextValue | null>(null);

const iconMap = {
  success: CheckCircle2,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
} as const;

const variantClasses = {
  success:
    "border-[color:rgb(62_107_82_/_0.28)] text-[var(--color-success)]",
  error:
    "border-[color:rgb(140_59_52_/_0.28)] text-[var(--color-error)]",
  warning:
    "border-[color:rgb(166_124_46_/_0.28)] text-[var(--color-warning)]",
  info:
    "border-[color:rgb(60_90_110_/_0.28)] text-[var(--color-info)]",
} as const;

interface ToastProviderProps {
  readonly children: ReactNode;
}

export function ToastProvider({
  children,
}: ToastProviderProps): React.JSX.Element {
  const [toasts, setToasts] =
   useState<ToastItem[]>([]);

 const dismissToast = useCallback(
   (toastId: string): void => {
     setToasts((current) =>
       current.filter(
         (toast) => toast.id !== toastId
       )
     );
   },
   []
 );

 const showToast = useCallback(
  (input: ToastInput): string => {
    const toastId =
     crypto.randomUUID();

   const toast: ToastItem = {
     ...input,
     id: toastId,
     variant: input.variant ?? "info",
     duration: input.duration ?? 4500,
   };

   setToasts((current) => [
     ...current,
     toast,
   ]);

   window.setTimeout(() => {
     dismissToast(toastId);
   }, toast.duration);

     return toastId;
   },
   [dismissToast]
 );

 const value = useMemo<ToastContextValue>(
   () => ({
     showToast,
     dismissToast,
   }),
   [dismissToast, showToast]
 );

 return (
  <ToastContext.Provider value={value}>
    {children}

   <div
    aria-live="polite"
    aria-relevant="additions removals"
    className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end
gap-3 sm:left-auto sm:w-[420px]"
   >
    {toasts.map((toast) => {
      const variant =
       toast.variant ?? "info";

      const Icon =
       iconMap[variant];

      return (
       <article
         key={toast.id}
         role={
           variant === "error"
            ? "alert"
            : "status"
         }
         className={cn(
           "pointer-events-auto flex w-full gap-4 rounded-lg border bg-card p-4",
           "shadow-[var(--shadow-modal)] animate-in slide-in-from-bottom-3 fade-in-0",
           variantClasses[variant]
         )}
       >
         <Icon
           aria-hidden={true}
           className="mt-0.5 size-5 shrink-0"
         />

           <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">
             {toast.title}
            </p>

            {toast.description ? (
              <p className="mt-1 text-sm leading-6 text-muted">
                {toast.description}
              </p>
            ) : null}
           </div>

             <IconButton
              label="Dismiss notification"
              icon={<X aria-hidden={true} />}
              appearance="ghost"
              size="sm"
              onClick={() =>
                dismissToast(toast.id)
              }
             />
            </article>
          );
        })}
       </div>
      </ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
 const context =
  useContext(ToastContext);

    if (!context) {
      throw new Error(
        "useToast must be used inside ToastProvider."
      );
    }

    return context;
}
