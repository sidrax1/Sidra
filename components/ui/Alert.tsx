import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import {
  cn,
} from "@/lib/utils";

const alertVariants = cva(
 [
   "relative flex gap-4 rounded-[var(--radius-md)] border p-4",
   "text-sm leading-relaxed shadow-[var(--shadow-card)]",
 ],
 {
   variants: {
     variant: {
      info: [
        "border-[color:rgb(60_90_110_/_0.25)]",
        "bg-[color:rgb(60_90_110_/_0.08)]",
        "text-[var(--color-info)]",
      ],

     success: [
       "border-[color:rgb(62_107_82_/_0.25)]",
       "bg-[color:rgb(62_107_82_/_0.08)]",
       "text-[var(--color-success)]",
     ],

     warning: [
       "border-[color:rgb(166_124_46_/_0.25)]",
       "bg-[color:rgb(166_124_46_/_0.08)]",
       "text-[var(--color-warning)]",
     ],

     error: [
       "border-[color:rgb(140_59_52_/_0.25)]",
       "bg-[color:rgb(140_59_52_/_0.08)]",
       "text-[var(--color-error)]",
     ],

      luxury: [
        "border-[color:rgb(200_169_106_/_0.3)]",
        "bg-[linear-gradient(135deg,rgba(200,169,106,0.12),rgba(200,169,106,0.04))]",
        "text-[var(--color-gold-600)]",
        "dark:text-[var(--color-gold-500)]",
      ],
    },
  },

  defaultVariants: {
    variant: "info",
  },

  }
);

const iconMap = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
  luxury: Info,
} as const;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
   VariantProps<typeof alertVariants> {
  readonly title?: string;
  readonly description?: ReactNode;
  readonly icon?: ReactNode;
  readonly action?: ReactNode;
}

export const Alert = forwardRef<
 HTMLDivElement,
 AlertProps
>(function Alert(
 {
   action,
   children,
   className,
   description,
   icon,
   title,
   variant = "info",
   ...props
 },
 forwardedRef
){
 const Icon =
   iconMap[variant ?? "info"];

 return (
  <div
    ref={forwardedRef}
    role={
     variant === "error"

   ? "alert"
   : "status"
 }
 className={cn(
   alertVariants({
     variant,
   }),
   className
 )}
 {...props}
>
 <div
   aria-hidden={true}
   className="mt-0.5 shrink-0"
 >
   {icon ?? (
     <Icon className="size-5" />
   )}
 </div>

 <div className="min-w-0 flex-1">
  {title ? (
    <p className="font-semibold text-current">
      {title}
    </p>
  ) : null}

  {description ? (
    <div
      className={cn(
        "text-current/85",
        title && "mt-1"
      )}
    >
      {description}
    </div>
  ) : null}

  {children}
 </div>

 {action ? (
  <div className="shrink-0">
   {action}

       </div>
     ) : null}
    </div>
  );
});

Alert.displayName = "Alert";

export {
  alertVariants,
};
