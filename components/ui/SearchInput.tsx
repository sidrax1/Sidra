"use client";

import {
 forwardRef,

  type InputHTMLAttributes,
} from "react";

import {
  Search,
  X,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";

import {
  Input,
} from "@/components/ui/Input";

import {
  cn,
} from "@/lib/utils";

interface SearchInputProps
  extends Omit<
   InputHTMLAttributes<HTMLInputElement>,
   "type"
  >{
  readonly onClear?: () => void;
}

export const SearchInput = forwardRef<
 HTMLInputElement,
 SearchInputProps
>(function SearchInput(
 {
   className,
   onClear,
   value,
   ...props
 },
 forwardedRef
){
 const hasValue =
   typeof value === "string" &&
   value.length > 0;

 return (
  <div className="relative">
    <Search
     aria-hidden={true}
     className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
    />

    <Input
     ref={forwardedRef}
     type="search"
     value={value}
     className={cn(
       "pl-11",
       hasValue && onClear
         ? "pr-12"
         : undefined,
       className
     )}
     {...props}
    />

     {hasValue && onClear ? (
       <IconButton
         label="Clear search"
         icon={<X aria-hidden={true} />}
         appearance="ghost"
         size="sm"
         onClick={onClear}
         className="absolute right-1.5 top-1/2 -translate-y-1/2"
       />
     ) : null}
    </div>
  );
});

SearchInput.displayName =
  "SearchInput";
