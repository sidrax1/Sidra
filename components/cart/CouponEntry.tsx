"use client";

import {
  CheckCircle2,
  Tag,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/Button";

import {
  Input,
} from "@/components/ui/Input";

import {
  cn,
} from "@/lib/utils";

interface CouponEntryProps {

    readonly appliedCode?: string | null;
    readonly loading?: boolean;
    readonly error?: string | null;
    readonly className?: string;
    readonly onApply: (
      code: string
    ) => void | Promise<void>;
    readonly onRemove: () => void | Promise<void>;
}

export function CouponEntry({
  appliedCode,
  className,
  error,
  loading = false,
  onApply,
  onRemove,
}: CouponEntryProps): React.JSX.Element {
  const [code, setCode] =
    useState("");

    if (appliedCode) {
      return (
        <div
         className={cn(
           "flex items-center justify-between gap-4 rounded-md border",
           "border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.08)] p-4",
           className
         )}
        >
         <div className="flex min-w-0 items-center gap-3">
           <CheckCircle2
             aria-hidden={true}
             className="size-5 shrink-0 text-[var(--color-success)]"
           />

       <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em]
text-[var(--color-success)]">
          Offer Applied
        </p>

          <p className="mt-1 truncate font-medium text-foreground">
           {appliedCode}

        </p>
       </div>
      </div>

       <Button
        variant="ghost"
        size="sm"
        loading={loading}
        loadingLabel="Removing"
        onClick={() => {
          void onRemove();
        }}
       >
        <X
          aria-hidden={true}
          className="size-3.5"
        />
        Remove
       </Button>
      </div>
    );
}

return (
 <form
   className={cn(
     "grid gap-3",
     className
   )}
   onSubmit={(event) => {
     event.preventDefault();

      const normalized =
       code
        .trim()
        .toUpperCase();

      if (!normalized) {
        return;
      }

      void onApply(
        normalized
      );

   }}
  >
   <label
     htmlFor="coupon-code"
     className="text-sm font-medium text-foreground"
   >
     Offer code
   </label>

    <div className="flex gap-3">
     <div className="relative min-w-0 flex-1">
      <Tag
        aria-hidden={true}
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2
text-muted"
      />

      <Input
       id="coupon-code"
       value={code}
       disabled={loading}
       invalid={Boolean(error)}
       autoComplete="off"
       placeholder="Enter code"
       className="pl-11 uppercase"
       onChange={(event) =>
         setCode(
           event.target.value
         )
       }
      />
     </div>

     <Button
      type="submit"
      variant="outline"
      loading={loading}
      loadingLabel="Applying"
      disabled={
        code.trim().length < 3
      }
     >
      Apply
     </Button>

      </div>

    {error ? (
      <p
        role="alert"
        className="text-sm text-[var(--color-error)]"
      >
        {error}
      </p>
    ) : null}
   </form>
 );
}
